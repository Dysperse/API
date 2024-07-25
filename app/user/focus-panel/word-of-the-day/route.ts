import { handleApiError } from "@/lib/handleApiError";
import { NextRequest } from "next/server";
import { NodeHtmlMarkdown } from "node-html-markdown";
let Parser = require("rss-parser");
let parser = new Parser();

export const OPTIONS = async () => {
  return new Response("", {
    status: 200,
    headers: { "Access-Control-Allow-Headers": "*" },
  });
};

export async function GET(req: NextRequest) {
  try {
    const feed = "https://www.merriam-webster.com/wotd/feed/rss2";
    const data = await parser.parseURL(feed);
    const word = data.items[0];

    // <![CDATA[ <font size="-1" face="arial, helvetica"> <p> <strong> <font color="#000066">Merriam-Webster's Word of the Day for July 24, 2024 is:</font> </strong> </p> <p> <strong>sanctimonious</strong> &#149; \sank-tuh-MOH-nee-us\&nbsp; &#149; <em>adjective</em><br /> <p>Someone described as sanctimonious behaves as though they are morally superior to others. Language or behavior that suggests the same kind of moral superiority can also be described as sanctimonious.</p> <p>// While the subject matter was interesting, I found the presenter’s <em>sanctimonious</em> tone rather distracting. </p> <p><a href="https://www.merriam-webster.com/dictionary/sanctimonious">See the entry ></a> </p> </p> <p> <strong>Examples:</strong><br /> <p>“Smart and sincere but never <em>sanctimonious</em>, the awareness-raising drama doubles as a public service message of sorts.” — Peter Debruge, <em>Variety</em>, 13 Mar. 2024 </p> </p> <p> <strong>Did you know?</strong><br /> <p>There’s nothing sacred about <em>sanctimonious</em>—at least not anymore. But in the early 1600s, the English adjective was still sometimes used to describe someone truly holy or pious, a sense at an important remove from today’s use describing someone who acts or behaves as though they are morally superior to others. (The now-obsolete “pious” sense recalls the meaning of the word’s Latin parent, <em>sanctimonia</em>, meaning “holiness” or “<a href="https://www.merriam-webster.com/dictionary/sanctity">sanctity</a>.”) <a href="https://www.britannica.com/biography/William-Shakespeare">Shakespeare</a> used both the “holy” and “holier-than-thou” senses of <em>sanctimonious</em> in his work, referring in <a href="https://www.britannica.com/topic/The-Tempest"><em>The Tempest</em></a> to the “sanctimonious” (that is, “holy”) ceremonies of marriage, and in <a href="https://www.britannica.com/topic/Measure-for-Measure"><em>Measure for Measure</em></a> to “the sanctimonious pirate that went to sea with the Ten Commandments but scraped one out of the table.” (Apparently, the pirate found the restriction on stealing inconvenient.)</p> <br /><br /> </p> </font> ]]>
    const partOfSpeech = word.content.match(/<em>(.*?)<\/em>/)[1];
    const definition = word.content.match(/<p>(.*?)<\/p>/)[1];
    const examples = word.content
      .split(`<strong>Examples:</strong><br />`)[1]
      .split(`<strong>Did you know?</strong><br />`)[0];

    const didYouKnow = word.content.split(
      `<strong>Did you know?</strong><br />`
    )[1];

    const exampleSentence = word.content.split("<p>//")[1].split(`</p>`)[0];
    const pronunciation = word.content.match(/&#149; (.*?)\&nbsp;/)[1];

    return Response.json({
      word: word.title,
      partOfSpeech,
      pronunciation,

      link: word.link,
      audio: word.enclosure,

      exampleSentence: NodeHtmlMarkdown.translate(exampleSentence).trim(),
      examples: NodeHtmlMarkdown.translate(examples),
      definition: NodeHtmlMarkdown.translate(definition),
      didYouKnow: NodeHtmlMarkdown.translate(didYouKnow),
    });
  } catch (e) {
    return handleApiError(e);
  }
}

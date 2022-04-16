import CheckList from "@editorjs/checklist";
import Code from "@editorjs/code";
import Delimiter from "@editorjs/delimiter";
import Embed from "@editorjs/embed";
import Image from "@editorjs/image";
import InlineCode from "@editorjs/inline-code";
import LinkTool from "@editorjs/link";
import List from "@editorjs/list";
import Marker from "@editorjs/marker";
import Quote from "@editorjs/quote";
import Raw from "@editorjs/raw";
import SimpleImage from "@editorjs/simple-image";
import Table from "@editorjs/table";
import Warning from "@editorjs/warning";

export const EDITOR_JS_TOOLS = {
	embed: Embed,
	table: Table,
	list: List,
	warning: Warning,
	code: Code,
	linkTool: LinkTool,
	image: Image,
	raw: Raw,
	quote: Quote,
	marker: Marker,
	checklist: CheckList,
	delimiter: Delimiter,
	inlineCode: InlineCode,
	simpleImage: SimpleImage
};

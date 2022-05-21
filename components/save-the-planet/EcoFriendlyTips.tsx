import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Tabs from "@mui/material/Tabs";
import { TipCard } from "./TipCard";

export function EcoFriendlyTips() {
  return (
    <Container sx={{ mt: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: "800", mb: 2 }}>
        Recommended
      </Typography>
      <Tabs
        centered
        variant="scrollable"
        scrollButtons
        sx={{
          "& .MuiTabs-scrollButtons.Mui-disabled": {
            // opacity: "0!important",
            maxWidth: "0px!important",
            margin: "0"
          },
          "& .MuiTabs-scrollButtons": {
            maxWidth: "100px",
            overflow: "hidden",
            transition: "all .2s",
            borderRadius: 4,
            background: "rgba(200,200,200,.4)",
            color: "#404040",
            "&:hover": {
              background: "rgba(200,200,200,.5)",
              color: "#000"
            },
            marginLeft: "5px",
            marginRight: "5px"
          },
          "& .MuiTabs-scroller": { borderRadius: 5 },

          maxWidth: "91vw",
          my: 2,
          "& .MuiTabs-indicator": {
            borderRadius: 5,
            height: "100%",
            background: "rgba(200,200,200,.4)",
            zIndex: -1
          },
          "& .Mui-selected": {
            color: global.theme === "dark" ? "#fff" : "#000!important"
          }
        }}
      >
        <TipCard
          modalContent={<>Test</>}
          tipOfTheDay
          name="Bike more often!"
          funFact="Did you know you can save 69 tons of carbon just by riding your bike to work?"
          icon="directions_bike"
        />
        <TipCard
          modalContent={<>Test</>}
          highlySuggested
          name="Use less water"
          funFact="Did you know you can save 49 gallons of water just by reducing the amount of water in your laundry machine?"
          icon="local_laundry_service"
        />
        <TipCard
          modalContent={<>Test</>}
          name="Save more electricity"
          funFact="Running your appliances outside the hours 4AM to 9PM helps conserve energy - and reduce your energy bill?"
          icon="electric_meter"
        />
        <TipCard
          modalContent={<>Test</>}
          name="Use less water"
          funFact="Did you know you can save up to 69420 gallons of water by limiting your sprinklers to 1 time a day?"
          icon="sprinkler"
        />
        <TipCard
          modalContent={<>Test</>}
          name="Buy an eco-friendly thermostat"
          funFact="Buying an eco friendly thermostat helps you save the environment, and some electricity providers discount your bills if you have one!"
          icon="energy_program_saving"
        />
        <TipCard
          modalContent={<>Test</>}
          name="Add attic insulation"
          funFact="Did you know that insulating your attic can reduce your electricity bill by 10-50%?!"
          icon="airware"
        />
        <TipCard
          modalContent={<>Test</>}
          name="Upgrade to an electric car"
          funFact="Upgrading to an electric car can significantly improve the environment, plus, it's worth the purchase"
          icon="electric_car"
        />
        <TipCard
          modalContent={<>Test</>}
          name="Switch to LEDs"
          funFact="LEDs are much safer for the environment, and could reduce your electricity bill by $215"
          icon="light"
        />
        <TipCard
          modalContent={<>Test</>}
          name="Upgrade to an electric fireplace"
          funFact="An electric furnace is much more safe for the environment, compared to a gas fireplace"
          icon="fireplace"
        />
        <TipCard
          modalContent={<>Test</>}
          name="Unplug unused devices, especially while traveling"
          funFact="This will help you greatly reduce your electricity bill"
          icon="outlet"
        />
        <TipCard
          modalContent={<>Test</>}
          name="Don't set your heater above 68°"
          funFact="Lowering your thermostat 10-15 degrees for eight hours can reduce your heating bill by 5-15%."
          icon="mode_heat"
        />
        <TipCard
          modalContent={<>Test</>}
          name="Don't set your AC below 78°"
          funFact="78 degrees is the sweet spot between staying cool and keeping your energy bill low"
          icon="mode_cool"
        />
      </Tabs>
    </Container>
  );
}

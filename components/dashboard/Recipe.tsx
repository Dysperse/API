import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import type { Meal } from "../../types/recipe";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";

/**
 * Description
 * @param { Meal } {recipe} : { recipe: Meal }
 * @returns {JSX.Element}
 */
export function Recipe({ recipe }: { recipe: Meal }): JSX.Element {
  const [open, setOpen] = useState(false);
  const url = recipe.strYoutube.replace("/watch?v=", "/embed/");
  return (
    <>
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        PaperProps={{
          elevation: 0,
          sx: {
            maxWidth: "800px",
            mx: "auto",
            borderRadius: "30px 30px 0 0",
          },
        }}
        disableSwipeToOpen
      >
        <Box
          sx={{
            maxHeight: "90vh",
            height: "90vh",
            borderRadius: "30px 30px 0 0",
            overflow: "scroll!important",
          }}
        >
          {recipe.strYoutube ? (
            <iframe
              title={recipe.strMeal}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              src={url}
              width="100%"
              height="300"
              style={{ borderRadius: "30px 30px 0 0" }}
              frameBorder="0"
            />
          ) : (
            <picture>
              <img
                style={{
                  width: "100%",
                  maxHeight: "300px",
                  objectFit: "cover",
                }}
                src={recipe.strMealThumb}
                alt={recipe.strMeal}
              />
            </picture>
          )}
          <Box sx={{ p: 4 }}>
            <Typography
              variant="h4"
              sx={{ fontWeight: "700" }}
              component="div"
              gutterBottom
            >
              {recipe.strMeal}
            </Typography>
            <Typography
              variant="h5"
              sx={{ fontWeight: "500" }}
              component="div"
              gutterBottom
            >
              Ingredients
            </Typography>
            {[...new Array(19)].map((_, i) => {
              if (recipe[`strIngredient${i + 1}`]) {
                return (
                  <Typography
                    key={recipe[`strIngredient${i + 1}`].toString()}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      textTransform: "capitalize",
                      mb: 1,
                      gap: 2,
                    }}
                  >
                    <div>
                      <span
                        className="material-symbols-outlined"
                        style={{ userSelect: "none" }}
                      >
                        radio_button_unchecked
                      </span>
                    </div>
                    <Box>
                      <div style={{ fontWeight: "500" }}>
                        {recipe[`strIngredient${i + 1}`]}
                      </div>
                      {recipe[`strMeasure${i + 1}`]}
                    </Box>
                  </Typography>
                );
              }
            })}
            <Typography
              variant="h5"
              sx={{ fontWeight: "500" }}
              component="div"
              gutterBottom
            >
              Instructions
            </Typography>
            {recipe.strInstructions.split("\n").map(function (item) {
              return (
                <span
                  key={item}
                  style={{ marginBottom: "10px", display: "block" }}
                >
                  {item}
                </span>
              );
            })}
            {recipe.strSource && (
              <Button
                href={recipe.strSource.toString()}
                target="_blank"
                fullWidth
                variant="outlined"
                sx={{
                  gap: 2,
                  borderWidth: "2px!important",
                  borderRadius: 5,
                  mt: 3,
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    userSelect: "none",
                    marginRight: "auto",
                    opacity: 0,
                    visibility: "hidden",
                  }}
                >
                  open_in_new
                </span>
                Source
                <span
                  className="material-symbols-outlined"
                  style={{ userSelect: "none", marginLeft: "auto" }}
                >
                  open_in_new
                </span>
              </Button>
            )}
          </Box>
        </Box>
      </SwipeableDrawer>
      <Paper>
        <Card
          sx={{
            mb: { xs: 2, sm: 0 },
            background: global.user.darkMode
              ? "hsl(240, 11%, 18%)"
              : "rgba(200,200,200,.3)",
            borderRadius: 5,
          }}
        >
          <CardActionArea onClick={() => setOpen(true)}>
            <CardMedia
              component="img"
              height="180"
              image={recipe.strMealThumb}
              alt={recipe.strMeal}
            />
            <CardContent>
              <Typography
                variant="h5"
                gutterBottom
                component="div"
                sx={{ fontWeight: "600" }}
              >
                {recipe.strMeal}
              </Typography>
              <Typography variant="body2" gutterBottom color="text.secondary">
                {recipe.strInstructions.slice(0, 100).trim()}...
              </Typography>
              <Chip sx={{ mt: 1, px: 1, mr: 1 }} label={recipe.strCategory} />
              <Chip sx={{ mt: 1, px: 1, mr: 1 }} label={recipe.strArea} />
            </CardContent>
          </CardActionArea>
        </Card>
      </Paper>
    </>
  );
}

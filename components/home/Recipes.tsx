import Box from "@mui/material/Box";
import LoadingButton from "@mui/lab/LoadingButton";
import Masonry from "@mui/lab/Masonry";
import { useState, useEffect } from "react";
import { Recipe } from "./Recipe";
import type { Meal } from "../../types/recipe";

/**
 * Recipe component
 * @returns {JSX.Element}
 */
export function Recipes(): JSX.Element {
  const [recipes, setRecipes] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(false);

  /**
   * Handles random recipe click
   * @returns {void}
   */
  const handleClick = (): void => {
    setLoading(true);
    fetch("https://www.themealdb.com/api/json/v1/1/random.php")
      .then((res) => res.json())
      .then((res: { meals: Meal[] }) => {
        setLoading(false);
        const recipeList: Meal[] = [res.meals[0], ...recipes];
        setRecipes(recipeList);
      });
  };

  // call `handleClick` on render
  useEffect(() => {
    handleClick();
  }, []);

  return (
    <Box>
      <Box
        sx={{
          position: "sticky",
          zIndex: 99,
          left: 0,
          px: { xs: 2, sm: 1 },
          top: { sm: "90px", xs: "80px" },
        }}
      >
        <LoadingButton
          loading={loading}
          onClick={handleClick}
          variant="contained"
          sx={{
            borderRadius: 999,
            width: "100%",
            gap: 2,
            backdropFilter: "blur(10px)",
          }}
          disableElevation
          size="large"
        >
          Random<span className="material-symbols-rounded">moving</span>
        </LoadingButton>
      </Box>
      <Masonry
        sx={{ mt: { xs: 5, sm: 1 } }}
        columns={{ xs: 1, sm: 3, lg: 3 }}
        spacing={{ xs: 0, sm: 1 }}
      >
        {recipes.map((recipe: Meal) => (
          <Recipe recipe={recipe} key={recipe.strMeal} />
        ))}
      </Masonry>
    </Box>
  );
}

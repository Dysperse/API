/**
 *
 * @param provided Provided parameters (usually something like `req.query`)
 * @param required Required parameters (`String[]`)
 * @returns {boolean}
 */
export const validateParams = (provided: any, required: string[]) => {
  const missingParams = required.filter(
    (key) => !provided.hasOwnProperty(key) || !provided[key]
  );
  if (missingParams.length > 0) {
    throw new Error(
      `Couldn't validate parameters: Missing ${missingParams.join(", ")}`
    );
  }
  return true;
};

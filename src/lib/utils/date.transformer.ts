export const DateTransformer = ({ value }) => {
  if (!value) return;
  return new Date(value);
}
export const BooleanTransformer = ({ value }) => {
  if (value !== 'true' && value !== 'false') return value;
  return value === 'true';
};
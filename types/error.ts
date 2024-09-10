export type ErrorObject = {
  formErrors: string[];
  fieldErrors: {
    [key: string]: string[];
  };
};

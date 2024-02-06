type AnyObject = { [key: string]: any };

export function removeFields(
  obj: { [key: string]: any },
  fieldsToRemove: string[]
): AnyObject {
  const newObj: AnyObject = { ...obj }; // Create a shallow copy of the original object

  fieldsToRemove.forEach((field) => {
    delete newObj[field];
  });

  return newObj;
}

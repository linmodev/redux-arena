export function isEmpty(obj: object | undefined) {
  if (obj === undefined) return true;
  for (let prop in obj) {
    if (obj.hasOwnProperty(prop)) return false;
  }

  return JSON.stringify(obj) === JSON.stringify({});
}

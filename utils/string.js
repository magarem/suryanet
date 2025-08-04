export function capitalizeFirstLetter(str) {
    if (!str || str.length === 0) {
      return "";
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
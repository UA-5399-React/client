export const capitalizeFirst = (value: string) =>
  value ? value.charAt(0).toUpperCase() + value.slice(1) : value;

export const splitFullName = (value: string) => {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return {
      firstName: undefined,
      lastName: undefined,
    };
  }

  const [firstName, ...lastNameParts] = trimmedValue.split(/\s+/);
  const lastName = lastNameParts.join(' ').trim();

  return {
    firstName,
    lastName: lastName || undefined,
  };
};

// returns field names from graphql request
module.exports = (field, parent) => {
  const fields = field.selectionSet.selections.reduce((fields, selection) => {
    fields.push(selection.name.value);
    return fields;
  }, []);
  if (parent) {
    fields.push(parent);
  }
  return fields;
};

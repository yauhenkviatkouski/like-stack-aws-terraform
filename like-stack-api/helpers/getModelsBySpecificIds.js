const { Types } = require('mongoose');

module.exports = async (model, field, ids, queryFields) => {
  const checkedIds = ids.map(id =>
    typeof id === 'object' ? id : Types.ObjectId(id),
  );
  const queryOptions = {};
  queryOptions[field] = { $in: checkedIds };
  return await model.find(queryOptions, queryFields);
};

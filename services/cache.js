const redis = require("redis");
const util = require("util");
const mongoose = require("mongoose");
const redisURL = "redis://127.0.0.1:6379/";
const client = redis.createClient(redisURL);

client.hget = util.promisify(client.hget);

const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function (options = {}) {
  this.useCache = true;
  this.hashKey = JSON.stringify(options.key || "");

  return this;
};

mongoose.Query.prototype.exec = async function () {
  if (!this.useCache) {
    return exec.apply(this, arguments);
  }

  const queryObjKey = JSON.stringify(
    Object.assign({}, this.getQuery(), {
      collection: this.model.collection.name,
    })
  );

  const cachedDoc = JSON.parse(await client.hget(this.hashKey, queryObjKey));
  if (!cachedDoc) {
    const mongoDOC = await exec.apply(this, arguments);
    client.hset(this.hashKey, queryObjKey, JSON.stringify(mongoDOC), "EX", 5);
    return mongoDOC;
  }
  const cachedToMongoDoc = Array.isArray(cachedDoc)
    ? cachedDoc.map((doc) => new this.model(doc))
    : new this.model(cachedDoc);

  return cachedToMongoDoc;
};

module.exports = {
  clearHash(hashKey) {
    client.del(hashKey);
  },
};

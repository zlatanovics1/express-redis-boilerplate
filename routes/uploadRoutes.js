const keys = require("./../config/keys");
const uuid = require("uuid/v4");
const aws = require("aws-sdk");
const requireLogin = require("../middlewares/requireLogin");

const S3 = new aws.S3({
  credentials: {
    accessKeyId: keys.accessKeyId,
    secretAccessKey: keys.secretAccessKey,
  },
  region: "eu-central",
});

module.exports = (app) => {
  app.route("/api/upload").get(requireLogin, (req, res) => {
    const key = `${req.user.id}/${uuid()}.jpeg`;

    S3.getSignedUrl(
      "putObject",
      {
        Bucket: "blogs-bucket-4902",
        Key: key,
        ContentType: "image/jpeg",
      },
      (err, url) => res.send({ key, url })
    );
  });
};

const User = require("./user");
const Tutor = require("./tutor");
const Class = require("./class");
const Message = require("./message");
const ClassRegistration = require("./classRegistration");
const Schedule = require("./schedule");
const TutorReview = require("./tutorReview");
const { setupAssociations } = require("./associations");

// Setup associations
setupAssociations();

module.exports = {
  User,
  Tutor,
  Class,
  Message,
  ClassRegistration,
  Schedule,
  TutorReview,
};

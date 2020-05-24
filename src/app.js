const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function findRepoById(id) {
  return repositories.find((item) => item.id === id);
}

app.get("/repositories", (request, response) => {
  //list repos
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  // New repo
  const newRepo = { id: uuid(), likes: 0, ...request.body };
  repositories.push(newRepo);
  return response.json(newRepo);
});

app.put("/repositories/:id", (request, response) => {
  // update repos
  const repoToUpdate = findRepoById(request.params.id);
  if (!repoToUpdate) return response.status(400).send();

  const { url, techs, title } = request.body;

  if (url) repoToUpdate.url = url;
  if (techs) repoToUpdate.techs = techs;
  if (title) repoToUpdate.title = title;

  return response.json(repoToUpdate);
});

app.delete("/repositories/:id", (request, response) => {
  // remove repo
  const indexRepoToRemove = repositories.findIndex(
    (item) => item.id === request.params.id
  );
  if (indexRepoToRemove < 0) return response.status(400).send();

  repositories.splice(indexRepoToRemove, 1);
  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  // give a like to object
  const likedRepo = findRepoById(request.params.id);
  if (!likedRepo) return response.status(400).send();
  likedRepo.likes += 1;
  return response.json({ likes: likedRepo.likes });
});

module.exports = app;

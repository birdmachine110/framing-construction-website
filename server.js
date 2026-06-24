"use strict";

const express = require("express");
const path = require("path");
const fs = require("fs").promises;

const app = express();
const PORT = process.env.PORT || 3000;

const contentFilePath = path.join(
  __dirname,
  "data",
  "content.json"
);

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/content", async function (request, response) {
  try {
    const fileContents = await fs.readFile(
      contentFilePath,
      "utf8"
    );

    const content = JSON.parse(fileContents);

    response.json({
      success: true,
      content: content
    });
  } catch (error) {
    console.error("Could not read content:", error);

    response.status(500).json({
      success: false,
      message: "The website content could not be loaded."
    });
  }
});

app.put(
  "/api/content/home-heading",
  async function (request, response) {
    try {
      const homeHeading =
        typeof request.body.homeHeading === "string"
          ? request.body.homeHeading.trim()
          : "";

      if (homeHeading.length < 3) {
        return response.status(400).json({
          success: false,
          message:
            "The heading must contain at least three characters."
        });
      }

      const fileContents = await fs.readFile(
        contentFilePath,
        "utf8"
      );

      const content = JSON.parse(fileContents);

      content.homeHeading = homeHeading;

      await fs.writeFile(
        contentFilePath,
        JSON.stringify(content, null, 2),
        "utf8"
      );

      response.json({
        success: true,
        message: "The home-page heading was saved.",
        content: content
      });
    } catch (error) {
      console.error("Could not save content:", error);

      response.status(500).json({
        success: false,
        message: "The website content could not be saved."
      });
    }
  }
);

app.put("/api/content", async function (request, response) {
  try {
    const updatedContent = {
      homeHeading:
        typeof request.body.homeHeading === "string"
          ? request.body.homeHeading.trim()
          : "",

      homeSubheading:
        typeof request.body.homeSubheading === "string"
          ? request.body.homeSubheading.trim()
          : "",

      companyName:
        typeof request.body.companyName === "string"
          ? request.body.companyName.trim()
          : "",

      phone:
        typeof request.body.phone === "string"
          ? request.body.phone.trim()
          : "",

      email:
        typeof request.body.email === "string"
          ? request.body.email.trim()
          : "",

      footerText:
        typeof request.body.footerText === "string"
          ? request.body.footerText.trim()
          : ""
    };

    if (updatedContent.homeHeading.length < 3) {
      return response.status(400).json({
        success: false,
        message: "The home heading must contain at least three characters."
      });
    }

    if (updatedContent.companyName.length < 2) {
      return response.status(400).json({
        success: false,
        message: "The company name must contain at least two characters."
      });
    }

    await fs.writeFile(
      contentFilePath,
      JSON.stringify(updatedContent, null, 2),
      "utf8"
    );

    response.json({
      success: true,
      message: "Website content was saved.",
      content: updatedContent
    });
  } catch (error) {
    console.error("Could not save website content:", error);

    response.status(500).json({
      success: false,
      message: "The website content could not be saved."
    });
  }
});

app.get("/api/status", function (request, response) {
  response.json({
    success: true,
    message: "HighPoint Framing server is running."
  });
});

app.listen(PORT, "0.0.0.0", function () {
  console.log(
    `HighPoint Framing is running at http://localhost:${PORT}`
  );
});
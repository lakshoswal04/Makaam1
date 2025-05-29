const router = require("express").Router();
const { Resource } = require("../models/resource");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

// Get all resources
router.get("/", async (req, res) => {
  try {
    const resources = await Resource.find();
    res.status(200).send({ data: resources });
  } catch (error) {
    res.status(500).send({ message: "Error fetching resources", error: error.message });
  }
});

// Get resources by domain
router.get("/domain/:domain", async (req, res) => {
  try {
    const resources = await Resource.find({ domain: req.params.domain });
    res.status(200).send({ data: resources });
  } catch (error) {
    res.status(500).send({ message: "Error fetching resources by domain", error: error.message });
  }
});

// Get resources by type
router.get("/type/:type", async (req, res) => {
  try {
    const resources = await Resource.find({ type: req.params.type });
    res.status(200).send({ data: resources });
  } catch (error) {
    res.status(500).send({ message: "Error fetching resources by type", error: error.message });
  }
});

// Get free or premium resources
router.get("/premium/:isPremium", async (req, res) => {
  try {
    const isPremium = req.params.isPremium === "true";
    const resources = await Resource.find({ isPremium });
    res.status(200).send({ data: resources });
  } catch (error) {
    res.status(500).send({ message: "Error fetching resources by premium status", error: error.message });
  }
});

// Create new resource - requires admin privileges
router.post("/", [auth, admin], async (req, res) => {
  try {
    const resource = await new Resource({
      ...req.body,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }).save();
    
    res.status(201).send({ data: resource, message: "Resource created successfully" });
  } catch (error) {
    res.status(500).send({ message: "Error creating resource", error: error.message });
  }
});

// Update resource - requires admin privileges
router.put("/:id", [auth, admin], async (req, res) => {
  try {
    const resource = await Resource.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        updatedAt: Date.now(),
      },
      { new: true }
    );
    
    if (!resource) {
      return res.status(404).send({ message: "Resource not found" });
    }
    
    res.status(200).send({ data: resource, message: "Resource updated successfully" });
  } catch (error) {
    res.status(500).send({ message: "Error updating resource", error: error.message });
  }
});

// Delete resource - requires admin privileges
router.delete("/:id", [auth, admin], async (req, res) => {
  try {
    const resource = await Resource.findByIdAndDelete(req.params.id);
    
    if (!resource) {
      return res.status(404).send({ message: "Resource not found" });
    }
    
    res.status(200).send({ message: "Resource deleted successfully" });
  } catch (error) {
    res.status(500).send({ message: "Error deleting resource", error: error.message });
  }
});

module.exports = router;

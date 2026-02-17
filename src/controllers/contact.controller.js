import Contact from "../models/Contact.js";

export const createContact = async (req, res) => {
  const newContact = new Contact(req.body);
  try {
    const savedContact = await newContact.save();
    res.status(200).json(savedContact);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.status(200).json(contacts);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const deleteContact = async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.status(200).json("Contact message has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
};
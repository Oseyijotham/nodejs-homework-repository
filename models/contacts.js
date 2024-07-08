import fs from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";
const contactsPath = path.join("models", "contacts.json");

export const listContacts = async (response, next) => {
  try {
    const data = await fs.readFile(contactsPath);
    const allData = JSON.parse(data);
    response.json({
      status: "success",
      code: 200,
      data: {
        allData,
      },
    });
  } catch (error) {
     next(error);
  }
};

export const getContactById = async (contactId, response, next) => {
  try {
    const data = await fs.readFile(contactsPath);
    const allData = JSON.parse(data);

    const bestMatch = allData.filter((contact) => contact.id === contactId);

    if (bestMatch.length === 0) {
      console.log(`No contact found with ID: ${contactId}`);
      const error = new Error(`No contact found with ID: ${contactId}`);
      error.status = 404;
      return next(error);
    } else {
      console.log(`Recovered contact with ID:${contactId}`);
      console.table(bestMatch);
      response.json({
        status: "success",
        code: 200,
        data: {
          bestMatch,
        },
      });
    }
  } catch (error) {
    next(error);
  }
};

export const removeContact = async (contactId, response, next) => {
  try {
    const data = await fs.readFile(contactsPath);
    const allData = JSON.parse(data);
    const myIndex = allData.findIndex((contact) => contact.id === contactId);
    allData.splice(myIndex, 1);
    if (myIndex === -1) {
      console.log(`Contact with ID: ${contactId} not found.`);
      const error = new Error(`No contact found with ID: ${contactId}`);
      error.status = 404;
      return next(error);
    }
    await fs.writeFile(contactsPath, JSON.stringify(allData, null, 2));
    console.log(`Contact with ID ${contactId} has been removed.`);
    console.table(allData);
    response.json({
      status: "success",
      code: 200,
      message: "Contact Deleted",
    });

    
  } catch (error) {
    next(error)
  }
};

export const addContact = async (body, response, next) => {
  try {
    const data = await fs.readFile(contactsPath);
    const allData = JSON.parse(data);
     body = {
      id: nanoid(),
      name: body.name,
      email: body.email,
      phone: body.phone,
    };
    if (body.name === undefined || body.email === undefined || body.phone === undefined) {
      console.log("Enter all feilds!!!");
      const error = new Error(`Missing required field`);
      error.status = 400;
      return next(error);
    }
    allData.push(body);
    console.log(`A new Contact with ID:${body.id} has been added.`);
    console.table(allData);
    await fs.writeFile(contactsPath, JSON.stringify(allData, null, 2));
    response.status(201).json({
      status: "success",
      code: 201,
      data: {
        body,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (contactId, body, response, next) => {
  try {
    const data = await fs.readFile(contactsPath);
    const allData = JSON.parse(data);
    

    const bestMatch = allData.filter((contact) => contact.id === contactId);

    if (bestMatch.length === 0) {
      console.log(`No contact found with ID: ${contactId}`);
      const error = new Error(`No contact found with ID: ${contactId}`);
      error.status = 404;
      return next(error);
    }
    else if (Object.keys(body).length === 0) {
      console.log(`Missing required field`);
      const error = new Error(`Missing required field`);
      error.status = 400;
      return next(error);
    } else if (!body) {
      console.log(`Missing required field`);
      const error = new Error(`Missing required field`);
      error.status = 400;
      return next(error);
    } else {
      console.log(`Updated contact with ID:${contactId}`);
      const newUpdate = { ...bestMatch[0], ...body };
      const myIndex = allData.indexOf(bestMatch[0]);
      allData[myIndex] = newUpdate;
      await fs.writeFile(contactsPath, JSON.stringify(allData, null, 2));
      console.table(allData);
      response.json({
        status: "success",
        code: 200,
        data: {
          newUpdate,
        },
      });
    }
  } catch (error) {
    next(error);
  }
};



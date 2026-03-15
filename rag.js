console.log('in rag')
import { indexTheDocuments } from "./prepare.js";

const filePaths = "./sample.pdf";
indexTheDocuments(filePaths);

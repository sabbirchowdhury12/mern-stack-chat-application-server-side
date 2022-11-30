const express = require('express');
const app = express();
require('dotenv').config();
const mongoose = require('mongoose');

// middleware 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
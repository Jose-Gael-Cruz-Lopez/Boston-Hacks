import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';
import {GoogleGenAI} from "@google/gen"

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI("AIzaSyCU_GLvprFPmHIMHH7VRM99Pl5fDIQxwiU");
const ai = new GoogleGenAI({
  apiKey: "AIzaSyCU_GLvprFPmHIMHH7VRM99Pl5fDIQxwiU"
});


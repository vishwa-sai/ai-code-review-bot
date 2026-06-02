import './fetch-polyfill.js'
import axios from "axios";
import * as core from '@actions/core'

import * as optionsJs from './options.js'
import * as utils from './utils.js'

// define type to save parentMessageId and conversationId
export type Ids = {
  parentMessageId?: string
  conversationId?: string
}

export class Bot {
   // not free

  private options: optionsJs.Options

  constructor(options: optionsJs.Options) {
    this.options = options

  }

  chat = async (message: string, ids: Ids): Promise<[string, Ids]> => {
    let new_ids: Ids = {}
    let response = ''
    try {
      ;[response, new_ids] = await this.chat_(message, ids)
    } catch (e: any) {
      core.warning(`Failed to chat: ${e}, backtrace: ${e.stack}`)
    } finally {
      return [response, new_ids]
    }
  }
private chat_ = async (message: string, ids: Ids): Promise<[string, Ids]> => {
  if (!message) return ["", {}];

  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama3-70b-8192",
        messages: [
          {
            role: "user",
            content: message,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const text = response.data.choices[0].message.content;

    return [text, {}];
  } catch (error: any) {
    core.warning(`Groq error: ${error.message}`);
    return ["Error from Groq API", {}];
  }
};
  }

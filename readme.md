# ELI5-GPT

ELI5-GPT is a Chrome extension that allows you to easily paraphrase text on any webpage using the OpenAI API. Simply hover over a paragraph of text, click the "OpenAI" icon, and the extension will generate a paraphrased version of the text for you, and replace it in-place.

## Installation

To install the ELI5-GPT Chrome extension:

1. Download the extension files from the [GitHub repository](https://github.com/ArshanKhanifar/eli5-gpt).
2. Get an API key from OpenAI. You may have to set up a billed account for this. 
3. replace [this line](content.js#L3) with your API key.
4. Open Google Chrome and navigate to the extensions page (chrome://extensions/).
5. Enable "Developer mode" by toggling the switch in the top-right corner.
6. Click the "Load unpacked" button in the top-left corner.
7. Select the extension files you downloaded in step 1.
8. The ELI5-GPT extension should now be installed and ready to use.

## Usage

To use the extension:
1. Navigate to a webpage with text you want to paraphrase.
2. Hover over a paragraph of text you want to paraphrase.
3. Click the "Paraphrase" button that appears.
4. The extension will generate a paraphrased version of the text and display it word by word in a typing animation.
5. Once the entire paraphrased text is displayed, it will replace the original text in the webpage.

## Configuration

To configure the extension, you can modify the following parameters in the `manifest.json` file:

- `max_tokens`: The maximum number of tokens to generate in the OpenAI API response. Increasing this value may result in more accurate paraphrased text, but may also increase the response time and API usage. Default: `256`.
- `temperature`: The "creativity" of the OpenAI API response. Lower values result in more conservative responses, while higher values result in more creative responses. Default: `0.7`.
- `stop`: An array of strings that the OpenAI API response should end with. Default: `["\n"]`.
- `model`: The OpenAI model to use for generating the response. Default: `text-davinci-002`.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgements

- The OpenAI API is used for generating the paraphrased text.

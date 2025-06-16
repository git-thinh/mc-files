
import assertInputTypes from './assertInputTypes.js';
import splitLongText from './splitLongText.js';

import url from 'url';


/**
 * Generate "Google TTS" audio URL
 *
 * @param {string}   text         length should be less than 200 characters
 * @param {object?}  option
 * @param {string?}  option.lang  default is "en"
 * @param {boolean?} option.slow  default is false
 * @param {string?}  option.host  default is "https://translate.google.com"
 * @return {string} url
 */
export const getAudioUrl = (text,
    { lang = 'en', slow = false, host = 'https://translate.google.com' } = {}) => {
    assertInputTypes(text, lang, slow, host);

    if (text.length > 200) {
        throw new RangeError(
            `text length (${text.length}) should be less than 200 characters. Try "getAllAudioUrls(text, [option])" for long text.`
        );
    }

    return (
        host +
        '/translate_tts' +
        url.format({
            query: {
                ie: 'UTF-8',
                q: text,
                tl: lang,
                total: 1,
                idx: 0,
                textlen: text.length,
                client: 'tw-ob',
                prev: 'input',
                ttsspeed: slow ? 0.24 : 1,
            },
        })
    );
};

/**
 * @typedef {object} Result
 * @property {string} shortText
 * @property {string} url
 */

/**
 * Split the long text into multiple short text and generate audio URL list
 *
 * @param {string}   text
 * @param {object?}  option
 * @param {string?}  option.lang        default is "en"
 * @param {boolean?} option.slow        default is false
 * @param {string?}  option.host        default is "https://translate.google.com"
 * @param {string?}  option.splitPunct  split punctuation
 * @return {Result[]} the list with short text and audio url
 */
export const getAllAudioUrls = (
    text,
    {
        lang = 'en',
        slow = false,
        host = 'https://translate.google.com',
        splitPunct = '',
    } = {}
) => {
    assertInputTypes(text, lang, slow, host);

    if (typeof splitPunct !== 'string') {
        throw new TypeError('splitPunct should be a string');
    }

    return splitLongText(text, { splitPunct }).map((shortText) => ({
        shortText,
        url: getAudioUrl(shortText, { lang, slow, host }),
    }));
};

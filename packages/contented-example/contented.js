/* eslint-disable */
import { defineDocumentType } from '../contented-processor';
import { computeContentHeadings } from '../contented-processor/fields/headings';
import { computePath, computeSections } from '../contented-processor/fields/path';

const Doc = defineDocumentType(() => ({
  name: 'Doc',
  filePathPattern: `docs/**/*.md`,
  fields: {
    title: {
      type: 'string',
      description: 'The title of the documentation.',
      required: true,
      default: 'Contented Documentation',
    },
    description: {
      type: 'string',
      required: false,
    },
  },
  computedFields: {
    path: computePath('/', /\d+:/g, ''),
    sections: computeSections(/docs\/?/g, /\d+:/g, ''),
    contentHeadings: computeContentHeadings(),
  },
}));

/** @type {ContentedConfig} */
export default {
  rootDir: './',
  types: [Doc],
};
import type { Schema, Attribute } from '@strapi/strapi';

export interface QuestionVariantsData extends Schema.Component {
  collectionName: 'components_question_variants_datas';
  info: {
    name: 'data';
    icon: 'poll';
    description: '';
  };
  attributes: {
    title: Attribute.String;
    subTitle: Attribute.String;
    labelLeft: Attribute.String;
    labelRight: Attribute.String;
  };
}

export interface QuestionVariantsGroup extends Schema.Component {
  collectionName: 'components_question_variants_groups';
  info: {
    name: 'group';
    icon: 'layers';
    description: '';
  };
  attributes: {
    group: Attribute.Enumeration<['YOUNG', 'MIDDLE', 'OLD']>;
    data: Attribute.Component<'question-variants.data', true>;
  };
}

export interface QuestionVariantsRoot extends Schema.Component {
  collectionName: 'components_question_variants_roots';
  info: {
    name: 'root';
    icon: 'help_outline';
    description: '';
  };
  attributes: {
    generation: Attribute.Enumeration<
      ['GEN_W', 'GEN_X', 'GEN_Y', 'GEN_Z', 'GEN_ALPHA', 'GEN_BETA']
    >;
    data: Attribute.Component<'question-variants.group', true>;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'question-variants.data': QuestionVariantsData;
      'question-variants.group': QuestionVariantsGroup;
      'question-variants.root': QuestionVariantsRoot;
    }
  }
}

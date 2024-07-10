import type { Schema, Attribute } from '@strapi/strapi';

export interface AnswersTemplateRoot extends Schema.Component {
  collectionName: 'components_answer_templates';
  info: {
    name: 'answer-template';
    icon: 'adjust';
    description: 'Template for answers';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    values: Attribute.Component<'answer-template.value', true>;
  };
}

export interface AnswersTemplateValue extends Schema.Component {
  collectionName: 'components_answer_template_values';
  info: {
    name: 'value';
    icon: 'adjust';
    description: 'Single answer value for templates';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    value: Attribute.Enumeration<
      [
        'EMPTY',
        'E',
        'I',
        'S',
        'N',
        'T',
        'J',
        'F',
        'P',
        'RESOURCE INVESTIGATOR',
        'IMPLEMENTER',
        'SHAPER',
        'MONITOR EVALUATOR',
        'SPECIALIST',
        'TEAM WORKER',
        'COORDINATOR',
        'PLANT',
        'COMPLETER FINISHER'
      ]
    > &
      Attribute.Required;
  };
}

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
      'answers-template.root': AnswersTemplateRoot;
      'answers-template.value': AnswersTemplateValue;
      'question-variants.data': QuestionVariantsData;
      'question-variants.group': QuestionVariantsGroup;
      'question-variants.root': QuestionVariantsRoot;
    }
  }
}

/**
 * test-personality controller
 */

import { factories } from '@strapi/strapi'
import getGeneration from '../../../utils/getGeneration';

export default factories.createCoreController('api::test-personality.test-personality', ({ strapi }) => ({
  myPersonalityTest: async (ctx, next) => {
    try {
      const user = ctx.state.user;
      if (!user) {
        return ctx.unauthorized('You must be logged in to view your personality test');
      }
      
      const { id } = ctx.params;
      if (!id) {
        return ctx.badRequest('ID is required');
      }

      const testPersonality = await strapi.entityService.findOne('api::test-personality.test-personality', id, {
        populate: {
          questions: {
            populate: {
              variants: {
                populate: {
                  data: {
                    populate: 'data',
                  },
                },
              },
            },
          },
        },
      });

      if (!testPersonality) {
        return ctx.notFound('Test personality not found');
      }

      // todo: check if order is set
	    // todo: check if order is paid
	    // todo: check if test is filled out or not
	    // todo: if ok - show test with questions
	    // const { test, questions, isLoading } = useQuestions(+id);
 
      // todo: get it from frontend - now its just fixed for testing purposes
      // const generation = 'GEN_ALPHA';
      // const group = 'YOUNG';
      const { generation, group } = getGeneration(user.birthYear);
      const FREQUENCY = 3;

      const filteredQuestions = testPersonality.questions.map((question) => {
        const filteredVariants = question.variants.filter((variant) => 
          variant.generation === generation &&
          variant.data.some((dataItem) => dataItem.group === group)
        );

        if (filteredVariants.length === 0) {
          return null;
        }

        const flattenedVariants = filteredVariants.flatMap((variant) =>
          variant.data
            .filter((dataItem) => dataItem.group === group)
            .flatMap((dataItem) => dataItem.data)
        );

        return {
          id: question.id,
          type: question.type,
          answerScale: question.answerScale,
          createdAt: question.createdAt,
          updatedAt: question.updatedAt,
          locale: question.locale,
          valueLeft: question.valueLeft,
          valueRight: question.valueRight,
          variants: flattenedVariants
        };
      }).filter((question) => question !== null);

      const limitQuestions = (questions) => {
        return questions.map((question) => {
          const shuffledVariants = question.variants.sort(() => 0.5 - Math.random());
          const limitedVariants = shuffledVariants.slice(0, FREQUENCY);
          return {
            ...question,
            variants: limitedVariants
          };
        });
      };
      
      const generateQuestions = (questions) => {
        const limitedQuestions = limitQuestions(questions);

        const mappedQuestions = limitedQuestions.flatMap((question) =>
          question.variants.map((variant) => ({
            idQuestion: question.id,
            type: question.type,
            answerScale: question.answerScale,
            createdAt: question.createdAt,
            updatedAt: question.updatedAt,
            id: variant.id,
            title: variant.title,
            subTitle: variant.subTitle,
            labelLeft: variant.labelLeft,
            labelRight: variant.labelRight,
            valueLeft: question.valueLeft,
            valueRight: question.valueRight
          }))
        );

        // Fisher-Yates shuffle
        for (let i = mappedQuestions.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [mappedQuestions[i], mappedQuestions[j]] = [mappedQuestions[j], mappedQuestions[i]];
        }

        return mappedQuestions;
      };

      const finalQuestions = generateQuestions(filteredQuestions);
      ctx.send({
        id: testPersonality.id,
        uid: testPersonality.uid,
        name: testPersonality.name,
        questions: finalQuestions,
      });
    } catch(err) {
      // todo
    }
  },
}));

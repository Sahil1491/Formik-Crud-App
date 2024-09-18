import * as Yup from 'yup';
import linkabaseStore from '../Stores/LinkabaseStore';

// Helper function to check if a row is disabled based on its index and relayType
const isRowDisabled = (rowIndex: number, relayType: string) => {
  const enabledRowsCount = linkabaseStore.getEnabledRowsCount(relayType);
  return rowIndex >= enabledRowsCount;
};

// Step 1 validation schema
export const validationSchemaStep1 = Yup.object().shape({
  relayType: Yup.string().required('Relay type is required'),
  simNumber: Yup.string().required('SIM number is required'),
  sorakomAccount: Yup.string().required('Sorakom account is required'),
  comment: Yup.string().required('comment is required'),
});

// Step 2 validation schema with conditional validation for enabled rows
export const validationSchemaStep2 = (isRowDisabled: (index: number) => boolean) => {
  return Yup.object().shape({
    rows: Yup.array().of(
      Yup.object().shape({
        targetType: Yup.string()
          .test('targetType', 'Target type is required', function (value, context) {
            const indexMatch = context?.path?.match(/\d+/); // Use optional chaining
            const index = indexMatch ? Number(indexMatch[0]) : -1;
            
            if (index !== -1 && !isRowDisabled(index)) {
              return !!value; // Validate only if the row is enabled
            }
            return true; // Skip validation if the row is disabled
          }),
        target: Yup.string()
          .test('target', 'Target is required', function (value, context) {
            const indexMatch = context?.path?.match(/\d+/); // Use optional chaining
            const index = indexMatch ? Number(indexMatch[0]) : -1;
            
            if (index !== -1 && !isRowDisabled(index)) {
              return !!value; // Validate only if the row is enabled
            }
            return true; // Skip validation if the row is disabled
          }),
        status: Yup.string()
          .test('status', 'Status is required', function (value, context) {
            const indexMatch = context?.path?.match(/\d+/); // Use optional chaining
            const index = indexMatch ? Number(indexMatch[0]) : -1;
            
            if (index !== -1 && !isRowDisabled(index)) {
              return !!value; // Validate only if the row is enabled
            }
            return true; // Skip validation if the row is disabled
          }),
        comment: Yup.string()
          .test('comment', 'Comment is required', function (value, context) {
            const indexMatch = context?.path?.match(/\d+/); // Use optional chaining
            const index = indexMatch ? Number(indexMatch[0]) : -1;
            
            if (index !== -1 && !isRowDisabled(index)) {
              return !!value; // Validate only if the row is enabled
            }
            return true; // Skip validation if the row is disabled
          }),
      })
    ),
  });
};

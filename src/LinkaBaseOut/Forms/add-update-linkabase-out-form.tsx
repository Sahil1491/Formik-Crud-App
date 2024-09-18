import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import ProgressBar from 'react-bootstrap/ProgressBar';
import 'bootstrap/dist/css/bootstrap.min.css';
import './add-update-linkabase-out-form.css';
import linkabaseStore from '../../Stores/LinkabaseStore';
import { ILinkabaseData, Step1Values, Step2Values, CombinedValues } from '../../Interfaces/ILinkabase';
import { observer } from 'mobx-react-lite';
import { validationSchemaStep1, validationSchemaStep2 } from '../../FormikValidations/formValidation';

interface AddUpdateLinkabaseModalProps {
  show: boolean;
  handleClose: () => void;
  editIndex: number | null;
  isEdit: boolean;
}

const getDefaultRows = () => ([
  {
    signalLight: 'red',
    targetType: '',
    target: '',
    relay: '',
    status: '',
    comment: '',

  },
  {
    signalLight: 'green',
    targetType: '',
    target: '',
    relay: '',
    status: '',
    comment: '',

  },
  {
    signalLight: 'orange',
    targetType: '',
    target: '',
    relay: '',
    status: '',
    comment: '',

  },
  {
    signalLight: 'blue',
    targetType: '',
    target: '',
    relay: '',
    status: '',
    comment: '',

  },
]);

const AddUpdateLinkabaseModal: React.FC<AddUpdateLinkabaseModalProps> = observer(({ show, handleClose, editIndex, isEdit }) => {
  const [step, setStep] = useState(1);
  const [step1Values, setStep1Values] = useState<Step1Values>({
    relayType: '',
    simNumber: '',
    sorakomAccount: '',
    comment: '',
  });

  const [step2Values, setStep2Values] = useState<Step2Values>({ rows: getDefaultRows() });
  const [targetOptions, setTargetOptions] = useState<string[][]>(getDefaultRows().map(() => []));

  useEffect(() => {
    if (show) {
      setStep(1); // Reset step to 1 whenever the modal is opened
      if (editIndex !== null && linkabaseStore.linkabaseData[editIndex]) {
        const data = linkabaseStore.linkabaseData[editIndex];
        setStep1Values({
          relayType: data.step1.relayType,
          simNumber: data.step1.simNumber,
          sorakomAccount: data.step1.sorakomAccount,
          comment: data.step1.comment,
        });

        // Merge existing rows with default rows, ensuring signal lights remain consistent
        const mergedRows = getDefaultRows().map((defaultRow, index) => {
          const existingRow = data.step2.rows[index] || {};
          return {
            ...defaultRow,
            ...existingRow,
            signalLight: defaultRow.signalLight, // Ensure signal light is always from default rows
            isEnabled: index < linkabaseStore.getEnabledRowsCount(data.step1.relayType),
          };
        });
        setStep2Values({ rows: mergedRows });

        // Set target options based on the targetType of each row
        const newTargetOptions = mergedRows.map(row => linkabaseStore.getTargetOptions(row.targetType));
        setTargetOptions(newTargetOptions);
      } else {
        setStep1Values({
          relayType: '',
          simNumber: '',
          sorakomAccount: '',
          comment: '',
        });
        setStep2Values({ rows: getDefaultRows() });
        setTargetOptions(getDefaultRows().map(() => []));
      }
    }
  }, [show, editIndex]);

  const handleNext = (values: Step1Values) => {
    setStep1Values(values);
    setStep(2);
  };

  const handlePrevious = () => {
    setStep(1);
  };

  const handleReset = (resetForm: () => void) => {
    resetForm();
    setStep(1);
    setStep1Values({
      relayType: '',
      simNumber: '',
      sorakomAccount: '',
      comment: '',
    });
    setStep2Values({ rows: getDefaultRows() });
    setTargetOptions(getDefaultRows().map(() => []));
  };

  // Function to determine if a row should be disabled based on the relay type
  const isRowDisabled = (rowIndex: number) => {
    // Get the count of enabled rows for the current relay type
    const enabledRowsCount = linkabaseStore.getEnabledRowsCount(step1Values.relayType);
    // Disable the row if its index is greater than or equal to the enabled rows count
    return rowIndex >= enabledRowsCount;
  };

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" dialogClassName="modal-dialog">
      <Modal.Header closeButton>
        <Modal.Title>{isEdit ? 'Update Linkabase Out' : 'Add Linkabase Out'}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <ProgressBar now={step === 1 ? 50 : 100} label={step === 1 ? '1: Basic Detail' : '2: Relay Type Detail'} />
        <div className="step-labels">
          <span>1: Basic Detail</span>
          <span>2: Relay Type Detail</span>
        </div>

        {step === 1 && (
          <Formik
            initialValues={step1Values}
            validationSchema={validationSchemaStep1}
            onSubmit={(values) => {
              handleNext(values);
            }}
            enableReinitialize
            validateOnChange={true}
            validateOnBlur={true}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="relayType">Relay Type</label>
                    <Field name="relayType" as="select" className="form-control">
                      <option value="">Select a relay type</option>
                      {linkabaseStore.getrelayTypes.map((getrelayTypes, index) => (
                        <option key={index} value={getrelayTypes}>
                          {getrelayTypes}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name="relayType" component="div" className="error-message" />
                  </div>

                  <div className="form-group">
                    <label htmlFor="simNumber">SIM Number</label>
                    <Field name="simNumber" type="text" className="form-control" />
                    <ErrorMessage name="simNumber" component="div" className="error-message" />
                  </div>

                  <div className="form-group">
                    <label htmlFor="sorakomAccount">Choose Sorakom Account</label>
                    <Field name="sorakomAccount" as="select" className="form-control">
                      <option value="">Select an account</option>
                      <option value="account1">Account 1</option>
                      <option value="account2">Account 2</option>
                    </Field>
                    <ErrorMessage name="sorakomAccount" component="div" className="error-message" />
                  </div>
                </div>

                <div className="comment-row form-group">
                  <label htmlFor="comment">Comment</label>
                  <Field name="comment" as="textarea" className="form-control" />
                  <ErrorMessage name="comment" component="div" className="error-message" />
                </div>

                <div className="button-container">
                  <Button type="submit" variant="primary" disabled={isSubmitting}>
                    Next
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        )}

        {step === 2 && (
          <Formik
            initialValues={step2Values}
            validationSchema={validationSchemaStep2(isRowDisabled)}
            onSubmit={(values, { resetForm }) => {
              console.log('Submitted values:', values);

              // Filter out rows that are disabled based on the relay type
              const enabledRows = values.rows.filter((_, index) => !isRowDisabled(index));

              const combinedValues: CombinedValues = {
                step1: step1Values,
                step2: {
                  ...values,
                  rows: enabledRows, // Only save enabled rows
                },
              };

              if (isEdit && editIndex !== null) {
                linkabaseStore.updateLinkabaseData(editIndex, combinedValues);
              } else {
                linkabaseStore.addLinkabaseData(combinedValues);
              }

              handleClose();
              handleReset(resetForm);
            }}
            enableReinitialize
            validateOnChange={true}
            validateOnBlur={true}
          >

            {({ isSubmitting, values, setFieldValue }) => (
              <Form>
                <FieldArray name="rows">
                  {() => (
                    <div className="table-container">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Signal Light</th>
                            <th>Target Type</th>
                            <th>Target</th>
                            <th>Relay</th>
                            <th>Status</th>
                            <th>Comment</th>
                          </tr>
                        </thead>
                        <tbody>
                          {values.rows.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                              <td>
                                <div className="signal-light">
                                  <div className={`light ${row.signalLight} active`}></div>
                                  <div className="signal-text">{`Signal ${rowIndex + 1}`}</div>
                                </div>
                              </td>

                              <td>
                                <Field
                                  name={`rows[${rowIndex}].targetType`}
                                  as="select"
                                  className="form-control"
                                  disabled={isRowDisabled(rowIndex)}
                                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                    const selectedTargetType = e.target.value;
                                    setFieldValue(`rows[${rowIndex}].targetType`, selectedTargetType);
                                    const options = linkabaseStore.getTargetOptions(selectedTargetType);
                                    setTargetOptions((prevOptions) => {
                                      const newOptions = [...prevOptions];
                                      newOptions[rowIndex] = options;
                                      return newOptions;
                                    });
                                  }}
                                >
                                  <option value="">Select Target Type</option>
                                  {linkabaseStore.getTargetTypes.map((type, idx) => (
                                    <option key={idx} value={type}>
                                      {type}
                                    </option>
                                  ))}
                                </Field>
                                {!isRowDisabled(rowIndex) && (
                                  <ErrorMessage name={`rows[${rowIndex}].targetType`} component="div" className="error-message" />
                                )}
                              </td>

                              <td>
                                <Field
                                  name={`rows[${rowIndex}].target`}
                                  as="select"
                                  className="form-control"
                                  disabled={isRowDisabled(rowIndex)}
                                >
                                  <option value="">Select Target</option>
                                  {targetOptions[rowIndex].map((option, idx) => (
                                    <option key={idx} value={option}>
                                      {option}
                                    </option>
                                  ))}
                                </Field>
                                {!isRowDisabled(rowIndex) && (
                                  <ErrorMessage name={`rows[${rowIndex}].target`} component="div" className="error-message" />
                                )}
                              </td>

                              <td>
                                {!isRowDisabled(rowIndex) && linkabaseStore.RelayFields(step1Values.relayType).map((relayValue, idx) => (
                                  <Field
                                    key={idx}
                                    name={`rows[${rowIndex}].relay${idx}`}
                                    as="input"
                                    type="text"
                                    className="form-control"
                                    value={relayValue}
                                    readOnly
                                  />
                                ))}
                              </td>


                              <td>
                                <Field
                                  name={`rows[${rowIndex}].status`}
                                  as="select"
                                  className="form-control"
                                  disabled={isRowDisabled(rowIndex)}
                                >
                                  <option value="">Select Status</option>
                                  {['Full', 'Crowd', 'Available', 'Close'].map((option) => (
                                    <option key={option} value={option}>
                                      {option}
                                    </option>
                                  ))}
                                </Field>
                                {!isRowDisabled(rowIndex) && (
                                  <ErrorMessage name={`rows[${rowIndex}].status`} component="div" className="error-message" />
                                )}
                              </td>

                              <td>
                                <Field
                                  name={`rows[${rowIndex}].comment`}
                                  as="textarea"
                                  className="form-control"
                                  disabled={isRowDisabled(rowIndex)}
                                />
                                {!isRowDisabled(rowIndex) && (
                                  <ErrorMessage name={`rows[${rowIndex}].comment`} component="div" className="error-message" />
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      <div className="button-container">
                        <Button variant="secondary" onClick={handlePrevious}>
                          Previous
                        </Button>
                        <Button type="submit" variant="primary" disabled={isSubmitting}>
                          {isEdit ? 'Update' : 'Submit'}
                        </Button>
                      </div>
                    </div>
                  )}
                </FieldArray>
              </Form>
            )}
          </Formik>
        )}
      </Modal.Body>
    </Modal>
  );
});

export default AddUpdateLinkabaseModal;

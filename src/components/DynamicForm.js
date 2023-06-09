import Element from './Element';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import React, { useState, useEffect } from 'react';
import 'react-tabs/style/react-tabs.css';

function DynamicForm(props) {
    const { dynamicForms } = props;
    const [tabIndex, setTabIndex] = useState(0);
    const [fields, setFields] = useState([]);
    const [pageId, setPageId] = useState(0);


    useEffect(() => {
        const extractedFields = [];
        dynamicForms.forEach((page) => {
            setPageId(page.page_id);
            page.tabs.forEach((tab) => {
                tab.fields.forEach((field) => {
                    extractedFields.push(field);
                });
            });
        });

        setFields(extractedFields);
        console.log("useEffect calling");
    }, [dynamicForms]);


    const handleInputChange = (event, field) => {
        console.log('handleInputChange' + field.field_id);
        dynamicForms.forEach((page) => {
            page.tabs.forEach((tab) => {
                tab.fields.forEach((current_field) => {
                    if (current_field.field_id === field.field_id) {
                        switch (field.field_type) {
                            case 'checkbox':
                                console.log('event ' + event.target.checked);
                                current_field.field_value = event.target.checked;
                                break;
                            default:
                                current_field.field_value = event.target.value;
                                break;
                        }
                    }
                });
            });
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(fields);
    }

    const handleDeleteField = (fieldToDelete) => {
        dynamicForms.forEach((page) => {
            page.tabs.forEach((tab) => {
                console.log(fieldToDelete);
                const updatedFields = tab.fields.filter(field => field.field_id !== fieldToDelete.field_id);
                tab.fields = updatedFields;
                setFields(updatedFields);
            })
        })
    };

    return (
        <div key={pageId} className="container">
            <form>
                {dynamicForms.map((form, m) => (
                    <h3 key={m}>{form.page_label}</h3>
                ))}
                <Tabs key={"dynamicTabId" + pageId} selectedIndex={tabIndex} onSelect={(index) => setTabIndex(index)}>
                    <TabList>
                        {dynamicForms.map((dynamicForms) => (
                            <React.Fragment key={dynamicForms.page_id}>
                                {dynamicForms.tabs.map((tab, i) => (
                                    <Tab key={i}>{tab.tab_label}</Tab>
                                ))}
                            </React.Fragment>
                        ))}
                    </TabList>
                    {dynamicForms.map((dynamicForms) => (
                        <React.Fragment key={dynamicForms.page_id}>
                            {dynamicForms.tabs.map((tab, j) => (
                                <TabPanel key={j}>
                                    <table className="table">
                                        <tbody>
                                            {tab.fields && tab.fields.reduce((acc, field, k) => {
                                                if (k % 2 === 0) {
                                                    acc.push(
                                                        <tr key={k}>
                                                            <td>
                                                                <Element key={k} field={field} onChange={handleInputChange} />
                                                                <button type="button" onClick={() => handleDeleteField(field)}>Delete</button>
                                                            </td>
                                                            {k + 1 < tab.fields.length && (
                                                                <td>
                                                                    <Element key={k + 1} field={tab.fields[k + 1]} onChange={handleInputChange} />
                                                                    <button type="button" onClick={() => handleDeleteField(tab.fields[k + 1])}>Delete</button>
                                                                </td>
                                                            )}
                                                        </tr>
                                                    );
                                                }
                                                return acc;
                                            }, [])}
                                        </tbody>
                                    </table>
                                </TabPanel>
                            ))}
                        </React.Fragment>
                    ))}
                </Tabs>
                <button type="submit" className="btn btn-primary" onClick={(e) => handleSubmit(e)}>Submit</button>
            </form>
        </div>
    );
}

export default DynamicForm;

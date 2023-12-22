import { Modal, Form, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { Obj } from "../models/object";
import { ObjInput } from "../models/objInput";
import * as ObjApi from "../network/objs_api";
import TextInputField from "./form/TextInputField";

interface AddEditObjDialogProps {
    objToEdit?: Obj;
    onDismiss: () => void;
    onObjSaved: (obj: Obj) => void;
}

const AddEditObjDialog = ({ objToEdit, onDismiss, onObjSaved }: AddEditObjDialogProps) => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ObjInput>({
        defaultValues: {
            url: objToEdit?.url || "",
            scrape_parameters: objToEdit?.scrape_parameters || "",
            text: objToEdit?.text || "",
        },
    });

    async function onSubmit(input: ObjInput) {
        try {
            let objResponse: Obj;
            if (objToEdit) {
                objResponse = await ObjApi.updateObj(objToEdit._id, input);
            } else {
                objResponse = await ObjApi.createObj(input);
            }
            onObjSaved(objResponse);
        } catch (error) {
            console.error(error);
            alert(error);
        }
    }

    return (
        <Modal show onHide={onDismiss}>
            <Modal.Header closeButton>
                <Modal.Title>{objToEdit ? "Edit Object" : "Add Object"}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form id="addEditObjForm" onSubmit={handleSubmit(onSubmit)}>
                    <TextInputField
                        name="url"
                        label="Website URL"
                        type="text"
                        placeholder="URL"
                        register={register}
                        registerOptions={{ required: "Required" }}
                        error={errors.url}
                    />

                    <TextInputField
                        name="scrape_parameters"
                        label="Scrape Parameters"
                        as="textarea"
                        rows={4}
                        placeholder="Text"
                        register={register}
                        registerOptions={{ required: "Required" }}
                        error={errors.scrape_parameters}
                    />

                    <TextInputField
                        name="text"
                        label="Text"
                        as="textarea"
                        rows={4}
                        placeholder="Text"
                        register={register}
                        error={errors.text}
                        readOnly
                    />
                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Button
                    type="submit"
                    form="addEditObjForm"
                    disabled={isSubmitting}
                    style={{
                        backgroundColor: "#164863",
                        transition: "background-color 0.3s",
                        borderColor: "#427d9d",
                        borderWidth: "1px",
                    }}
                    onMouseDown={(e) => {
                        e.currentTarget.style.backgroundColor = "#9bbec8";
                        e.currentTarget.style.borderColor = "#9bbec8";
                        e.currentTarget.style.borderWidth = "2px";
                    }}
                    onMouseUp={(e) => {
                        e.currentTarget.style.backgroundColor = "#427d9d";
                        e.currentTarget.style.borderWidth = "1px";
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#427d9d";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#164863";
                        e.currentTarget.style.borderWidth = "1px";
                    }}
                >
                    Save
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AddEditObjDialog;

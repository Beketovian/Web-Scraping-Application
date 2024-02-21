import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { ScrapeConfig, ScrapeConfigInput } from "../../../models/scrapeConfig";
import * as ObjApi from "../../../network/objs_api";
import { fetchHtmlContent } from "../../../network/objs_api";
import { SelectorEditableTable } from "./SelectorEditableTable";
import TextInputField from "./TextInputField";

interface AddEditScrapeConfigProps {
  scrapeConfig?: ScrapeConfig;
  onDismiss: () => void;
  onScrapeConfigSaved: (scrapeConfig: ScrapeConfig) => void;
}

const AddEditObjDialog = ({
  scrapeConfig,
  onDismiss,
  onScrapeConfigSaved,
}: AddEditScrapeConfigProps) => {
  const [iframeSrc, setIframeSrc] = useState("");
  const [selector, setSelector] = useState<any>("");
  const [scrapeParametersArray, setScrapeParametersArray] = useState<any[]>(
    scrapeConfig?.scrapeParameters
      ? [
          ...scrapeConfig.scrapeParameters,
          { id: uuidv4(), name: "", value: "", description: "" },
        ]
      : [{ id: uuidv4(), name: "", value: "", description: "" }]
  );

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ScrapeConfigInput>({
    defaultValues: {
      name: scrapeConfig?.name || "",
      description: scrapeConfig?.description || "",
      url: scrapeConfig?.url || "",
      scrapeParameters: scrapeParametersArray.slice(0, -1),
      scrapeIntervalMinute: scrapeConfig?.scrapeIntervalMinute || 60,
      emailNotification: "none",
      saveDataOn: "save_on_changes",
    },
  });

  const url = watch("url");

  useEffect(() => {
    if (url) {
      fetchHtmlContent(url)
        .then((htmlContent) => {
          setIframeSrc(htmlContent);
        })
        .catch((error) => console.error("Error fetching HTML:", error));
    }
  }, [url]);

  useEffect(() => {
    const receiveMessage = (event: any) => {
      if (event.origin !== window.location.origin) {
        return;
      }
      if (event.data.selector) {
        setSelector(event.data.selector);
      }
    };

    window.addEventListener("message", receiveMessage);
    return () => window.removeEventListener("message", receiveMessage);
  }, []);

  async function onSubmit(input: ScrapeConfigInput) {
    const inputWithScrapeParameters = {
      ...input,
      scrapeParameters: scrapeParametersArray.slice(0, -1),
    };
    try {
      const scrapeConfigResponse = scrapeConfig
        ? await ObjApi.updateObj(scrapeConfig._id, inputWithScrapeParameters)
        : await ObjApi.createObj(inputWithScrapeParameters);
      onScrapeConfigSaved(scrapeConfigResponse);
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  return (
    <Modal show onHide={onDismiss} fullscreen={true}>
      <Modal.Header closeButton>
        <Modal.Title style={{ fontSize: "18px" }}>
          {scrapeConfig ? "Edit Configuration" : "Create Configuration"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            height: "80vh",
          }}
        >
          <div style={{ flex: 1, paddingRight: "20px" }}>
            <iframe
              srcDoc={iframeSrc}
              style={{ width: "100%", height: "100%" }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <Form id="addEditObjForm" onSubmit={handleSubmit(onSubmit)}>
              <TextInputField
                name="name"
                label="Configuration Name"
                type="text"
                placeholder="Name"
                register={register}
                registerOptions={{ required: "Required" }}
                error={errors.name}
              />
              <TextInputField
                name="description"
                label="Description"
                type="text"
                placeholder="Description"
                register={register}
                registerOptions={{}}
                error={errors.description}
              />
              <TextInputField
                name="url"
                label="Website URL"
                type="text"
                placeholder="URL"
                register={register}
                registerOptions={{ required: "Required" }}
                error={errors.url}
              />
              <Form.Group className="mb-3">
                <Form.Label>Captured Selector</Form.Label>
                <Form.Control
                  placeholder=".example"
                  value={selector}
                  readOnly={true}
                />
              </Form.Group>
              <TextInputField
                name="scrapeIntervalMinute"
                label="Scrape Interval (Minutes)"
                type="number"
                placeholder="Enter interval in minutes"
                register={register}
                registerOptions={{ required: "Required" }}
                error={errors.scrapeIntervalMinute}
              />
              <Form.Group className="mb-3">
                <Form.Label>Save Data On</Form.Label>
                <Form.Select
                  {...register("saveDataOn")}
                  aria-label="Save Data Setting Select"
                >
                  <option value="save_on_changes">Save on changes only</option>
                  <option value="save_on_scrape">
                    Save on successful scrape
                  </option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email Notifcation</Form.Label>
                <Form.Select
                  {...register("emailNotification")}
                  aria-label="Email Notification Select"
                >
                  <option value="none">None</option>
                  <option value="update_on_changes">
                    Notify only on changes
                  </option>
                  <option value="update_on_scrape">
                    Notify upon successful scrape
                  </option>
                </Form.Select>
              </Form.Group>
              <SelectorEditableTable
                scrapeParametersArray={scrapeParametersArray}
                setScrapeParametersArray={setScrapeParametersArray}
              />
              <Button
                style={{ marginBottom: "20px" }}
                disabled={isSubmitting}
                variant="contained"
                type="submit"
              >
                Save
              </Button>
            </Form>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default AddEditObjDialog;

"use client";
import { Patient } from "@/lib/generated/prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

import { Controller } from "react-hook-form";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "./ui/field";
import { Input } from "./ui/input";
import usePatientRegistration from "@/app/(protected)/patient/_hooks/patient-registeration";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { GenderList, Marital_status, Relation } from "@/constants";

import { InputGroup, InputGroupTextarea } from "./ui/input-group";
import { Checkbox } from "./ui/checkbox";
import { useEffect } from "react";
import { Spinner } from "./ui/spinner";

interface IPatientForm {
  data?: Patient | null;
  type: "create" | "update";
}

function PatientForm({ data, type }: IPatientForm) {
  const { form, loading, onSubmit, onError } = usePatientRegistration(data);

  useEffect(() => {
    if (data) {
      form.setValue("address", data.address);
      form.setValue("gender", data.gender);
      form.setValue("phone", data.phone);
      form.setValue("emergency_contact_name", data.emergency_contact_name);
      form.setValue("emergency_contact_number", data.emergency_contact_number);
      form.setValue("date_of_birth", data.date_of_birth);
      form.setValue(
        "marital_status",
        data.marital_status as
          | "married"
          | "single"
          | "divorced"
          | "widowed"
          | "separated"
          | null,
      );
      form.setValue(
        "relation",
        data.relation as
          | "mother"
          | "father"
          | "husband"
          | "wife"
          | "other"
          | null,
      );
      form.setValue("blood_group", data.blood_group);
      form.setValue("allergies", data.allergies);
      form.setValue("insurance_provider", data.insurance_provider);
      form.setValue("insurance_number", data.insurance_number);
      form.setValue("privacy_consent", data.privacy_consent);
      form.setValue("medical_consent", data.medical_consent);
      form.setValue("service_consent", data.service_consent);
    }
  }, [data]);

  return (
    <Card className="max-w-4xl w-full  p-2 md:p-4 bg-white border border-s-slate-200  shadow-xl">
      <CardHeader>
        <CardTitle>Patient Register</CardTitle>
        <CardDescription>
          Please Provide all the information to help us undestand better and
          provide good and quality service to you
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="register"
          className="flex flex-col gap-8"
          onSubmit={form.handleSubmit(onSubmit, onError)}
        >
          {/* Personal Information */}
          <FieldGroup>
            <h3 className="text-lg font-semibold text-black mb-4">
              Personnel information
            </h3>
            {/* FirstName - LastName */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                name="first_name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className="text-black" htmlFor="first_name">
                      FirstName
                    </FieldLabel>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      id="first_name"
                      className="text-black bg-white! border border-slate-200 py-6!"
                      placeholder="Enter your FirstName"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="last_name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className="text-black" htmlFor="last_name">
                      LastName
                    </FieldLabel>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      id="last_name"
                      className="text-black bg-white! border border-slate-200 py-6!"
                      placeholder="Enter your FirstName"
                      value={field.value}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
            {/* Gender - Date of birth */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                name="gender"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="Gender" className="text-black">
                      Gender
                    </FieldLabel>
                    <Select
                      items={GenderList}
                      value={field.value}
                      name={field.name}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger
                        aria-invalid={fieldState.invalid}
                        className={"w-full  py-6 bg-white! text-black"}
                      >
                        <SelectValue placeholder="Select Gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Gender</SelectLabel>
                          {GenderList.map((item, index) => (
                            <SelectItem key={index} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name="date_of_birth"
                render={({ field, fieldState }) => (
                  <Field className=" w-full" data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="date_of_birth" className="text-black">
                      Date of birth
                    </FieldLabel>
                    <Popover>
                      <PopoverTrigger
                        render={
                          <Button
                            variant={"outline"}
                            id="date_of_birth"
                            aria-invalid={fieldState.invalid}
                            className={
                              "justify-start border-slate-200! bg-white! hover:text-black text-black py-6 font-normal"
                            }
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        }
                      />
                      <PopoverContent
                        className="w-auto md:w-85 p-0"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            field.onChange(date);
                          }}
                          defaultMonth={field.value ?? new Date()}
                          captionLayout="dropdown"
                          className="w-full"
                        />
                      </PopoverContent>
                    </Popover>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
            {/* Email - phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field aria-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="email" className="text-black">
                      Email
                    </FieldLabel>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      id="email"
                      className="text-black bg-white! border border-slate-200 py-6!"
                      placeholder="example@gmail.com"
                      value={field.value}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name="phone"
                render={({ field, fieldState }) => (
                  <Field aria-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="phone" className="text-black">
                      Phone
                    </FieldLabel>
                    <Input
                      {...field}
                      id="phone"
                      placeholder="+212 00 00 00 00"
                      className="text-black bg-white! border border-slate-200 py-6!"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            {/* Adress */}
            <div className="w-full">
              <Controller
                control={form.control}
                name="address"
                render={({ field, fieldState }) => (
                  <Field aria-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="adress" className="text-black">
                      Adress
                    </FieldLabel>
                    <InputGroup className="overflow-hidden">
                      <InputGroupTextarea
                        {...field}
                        id="adress"
                        rows={6}
                        className="w-full bg-white! text-black!  "
                        aria-invalid={fieldState.invalid}
                        placeholder="Enter your adress"
                      />
                    </InputGroup>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
          </FieldGroup>
          {/* Family Information */}
          <FieldGroup>
            <h3 className="text-xl font-semibold text-black mb-4">
              Family information
            </h3>
            {/* Emergency contact name / number */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                control={form.control}
                name="emergency_contact_name"
                render={({ field, fieldState }) => (
                  <Field aria-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="em-c-name" className="text-black">
                      Emergency contact name
                    </FieldLabel>
                    <Input
                      id="em-c-name"
                      aria-invalid={fieldState.invalid}
                      {...field}
                      placeholder="Enter Emergency contact name"
                      className="text-black bg-white! border border-slate-200 py-6!"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name="emergency_contact_number"
                render={({ field, fieldState }) => (
                  <Field aria-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="em-c-contact" className="text-black">
                      Emergency contact number
                    </FieldLabel>
                    <Input
                      id="em-c-contact"
                      aria-invalid={fieldState.invalid}
                      {...field}
                      placeholder="+212 00 00 00 00"
                      className="text-black bg-white! border border-slate-200 py-6!"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
            {/* Marital status - relation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                control={form.control}
                name="marital_status"
                render={({ field, fieldState }) => (
                  <Field aria-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="marital_status" className="text-black">
                      Marital status
                    </FieldLabel>
                    <Select
                      id="marital_status"
                      items={Marital_status}
                      value={field.value}
                      name={field.name}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger
                        aria-invalid={fieldState.invalid}
                        className={"w-full  py-6 bg-white! text-black"}
                      >
                        <SelectValue placeholder="Select marital status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Marital status</SelectLabel>
                          {Marital_status.map((item, index) => (
                            <SelectItem key={index} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name="relation"
                render={({ field, fieldState }) => (
                  <Field aria-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="relation" className="text-black">
                      Relation
                    </FieldLabel>

                    <Select
                      id="relation"
                      items={Relation}
                      value={field.value}
                      name={field.name}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger
                        aria-invalid={fieldState.invalid}
                        className={"w-full  py-6 bg-white! text-black"}
                      >
                        <SelectValue placeholder="Select relation" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Relation</SelectLabel>
                          {Relation.map((item, index) => (
                            <SelectItem key={index} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
          </FieldGroup>
          {/* Medical Information */}
          <FieldGroup>
            <h3 className="text-xl font-semibold text-black ">
              Medical information
            </h3>
            {/* blood group / allergies */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                control={form.control}
                name="blood_group"
                render={({ field, fieldState }) => (
                  <Field aria-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="blood_group" className="text-black">
                      Blood group{" "}
                      <span className="text-slate-400">(optional)</span>
                    </FieldLabel>
                    <Input
                      {...field}
                      value={field.value || ""}
                      id="blood_group"
                      aria-invalid={fieldState.invalid}
                      placeholder="A+"
                      className="bg-white! text-black py-6 border border-slate-300"
                      onChange={(data) => {
                        field.onChange(data);
                      }}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name="allergies"
                render={({ field, fieldState }) => (
                  <Field aria-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="allergies" className="text-black">
                      Allergies{" "}
                      <span className="text-slate-400">(optional)</span>
                    </FieldLabel>
                    <Input
                      {...field}
                      value={field.value || ""}
                      id="allergies"
                      aria-invalid={fieldState.invalid}
                      placeholder="Milk, Yougort..."
                      className="bg-white! text-black py-6 border border-slate-300"
                      onChange={(data) => {
                        field.onChange(data);
                      }}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
            {/* insurance provider / number */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                control={form.control}
                name="insurance_provider"
                render={({ field, fieldState }) => (
                  <Field aria-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="insurance_provider"
                      className="text-black"
                    >
                      Insurance provider
                      <span className="text-slate-400">(optional)</span>
                    </FieldLabel>
                    <Input
                      {...field}
                      value={field.value || ""}
                      id="insurance_provider"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter insurance provider"
                      className="bg-white! text-black py-6 border border-slate-300"
                      onChange={(data) => {
                        field.onChange(data);
                      }}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name="insurance_number"
                render={({ field, fieldState }) => (
                  <Field aria-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="insurance_number"
                      className="text-black"
                    >
                      Insurance number
                      <span className="text-slate-400">(optional)</span>
                    </FieldLabel>
                    <Input
                      {...field}
                      id="insurance_number"
                      value={field.value || ""}
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter insurance number"
                      className="bg-white! text-black py-6 border border-slate-300"
                      onChange={(data) => {
                        field.onChange(data);
                      }}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
          </FieldGroup>
          {/* Consent */}
          {type === "update" ? null : (
            <FieldGroup>
              <h3 className="text-xl font-semibold text-black ">Consent</h3>
              <Controller
                control={form.control}
                name="privacy_consent"
                render={({ field, fieldState }) => (
                  <Field
                    orientation={"horizontal"}
                    aria-invalid={fieldState.invalid}
                  >
                    <Checkbox
                      className="bg-white!"
                      aria-invalid={fieldState.invalid}
                      onCheckedChange={(data) => field.onChange(data)}
                      checked={field.value}
                      id="privacy_consent"
                      name="privacy_consent"
                    />
                    <FieldContent>
                      <FieldLabel
                        htmlFor="privacy_consent"
                        className="text-black"
                      >
                        Privacy Policy Agreement
                      </FieldLabel>
                      <FieldDescription>
                        Privacy Policy Agreement" placeholder=" I consent to the
                        collection, storage, and use of my personal and health
                        information as outlined in the Privacy Policy. I
                        understand how my data will be used, who it may be
                        shared with, and my rights regarding access, correction,
                        and deletion of my data." type="checkbox
                      </FieldDescription>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </FieldContent>
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name="service_consent"
                render={({ field, fieldState }) => (
                  <Field aria-invalid={fieldState.invalid}>
                    <Field orientation={"horizontal"}>
                      <Checkbox
                        id="service_terms"
                        name="service_terms"
                        className="bg-white!"
                        onCheckedChange={(data) => field.onChange(data)}
                        checked={field.value}
                        aria-invalid={fieldState.invalid}
                      />
                      <FieldContent>
                        <FieldLabel
                          className="text-black"
                          htmlFor="service_terms"
                          id="service_terms"
                        >
                          Terms of Service Agrement
                        </FieldLabel>
                        <FieldDescription>
                          Terms of Service Agreement" placeholder=" I agree to
                          the Terms of Service, including my responsibilities as
                          a user of this healthcare management system, the
                          limitations of liability, and the dispute resolution
                          process. I understand that continued use of this
                          service is contingent upon my adherence to these
                          terms.
                        </FieldDescription>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </FieldContent>
                    </Field>
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name="medical_consent"
                render={({ field, fieldState }) => (
                  <Field aria-invalid={fieldState.invalid}>
                    <Field orientation={"horizontal"}>
                      <Checkbox
                        id="medical_terms"
                        className="bg-white!"
                        aria-invalid={fieldState.invalid}
                        onCheckedChange={(data) => field.onChange(data)}
                        checked={field.value}
                        name="medical_terms"
                      />
                      <FieldContent>
                        <FieldLabel
                          className="text-black"
                          htmlFor="medical_terms"
                          id="medical_terms"
                        >
                          Informed Consent for Medical Treatment"
                        </FieldLabel>
                        <FieldDescription>
                          I provide informed consent to receive medical
                          treatment and services through this healthcare
                          management system. I acknowledge that I have been
                          informed of the nature, risks, benefits, and
                          alternatives to the proposed treatments and that I
                          have the right to ask questions and receive further
                          information before proceeding.
                        </FieldDescription>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </FieldContent>
                    </Field>
                  </Field>
                )}
              />
            </FieldGroup>
          )}
        </form>
      </CardContent>
      <CardFooter className="bg-transparent">
        <Field orientation="horizontal">
          <Button
            disabled={loading}
            variant="secondary"
            type="submit"
            form="register"
            className="hover:bg-black/40 cursor-pointer"
          >
            {loading ? (
              <Spinner fontSize={3} />
            ) : type === "create" ? (
              "Submit"
            ) : (
              "Update"
            )}
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}

export default PatientForm;

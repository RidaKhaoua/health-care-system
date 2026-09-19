"use client";
import { IPatient } from "@/types/patient-type";
import React, { useMemo } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Button } from "../ui/button";
import { Calendar1, UserRoundPen } from "lucide-react";
import ProfileImage from "../ProfileImage";
import useBookAppointment from "@/app/(protected)/records/appointments/_hooks/useBookAppointment";
import { Controller } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "../ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";
import { generateTimes } from "@/utils";
import { InputGroup, InputGroupTextarea } from "../ui/input-group";
import { Spinner } from "../ui/spinner";
import { TYPES_Appointment } from "@/constants";

interface IBookAppointmentProps {
  patient: Pick<IPatient, "first_name" | "last_name" | "gender" | "img">;
  doctor: IDoctor[];
}

function BookAppointment({ patient, doctor }: IBookAppointmentProps) {
  const { form, submitForm, loading } = useBookAppointment();
  const docotorOptions = useMemo(() => {
    return doctor.map((item) => ({
      label: item.name,
      value: item.id,
      img: item.img,
      specialization: item.specialization,
    }));
  }, [doctor]);
  const timerOptions = useMemo(() => {
    const times = generateTimes(8, 18, 30);
    return times.map((item) => ({ label: item, value: item }));
  }, []);
  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button
            variant={"default"}
            className="py-5! cursor-pointer w-full md:w-fit hover:opacity-80 duration-300 bg-blue-500! text-white!"
          >
            <UserRoundPen className="size-4" />
            <span className="">Book an appointement</span>
          </Button>
        }
      />
      <SheetContent className={"bg-white! overflow-y-scroll!"}>
        <SheetHeader>
          <SheetTitle className="text-black! font-bold py-4">
            Book Appointment
          </SheetTitle>
        </SheetHeader>
        <div className="p-3 space-y-6">
          {/* Profile Image - info Patient */}
          <div className="flex  items-center rounded-md p-2 gap-2 border border-slate-400">
            <ProfileImage
              imageUrl={patient.img}
              name={`${patient.first_name} ${patient.last_name}`}
            />
            <div className="flex flex-col gap-1 p-2">
              <p className="text-black font-semibold">
                {patient.first_name} {patient.last_name}
              </p>
              <p className="text-slate-400 capitalize">
                {patient.gender.toLowerCase()}
              </p>
            </div>
          </div>
          <form
            id="bookAppointment"
            onSubmit={form.handleSubmit(submitForm)}
            className="space-y-6"
          >
            {/* Type Appointment */}
            <Controller
              name="appointmentType"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="Appointment_Type" className="text-black">
                    Appointment Type
                  </FieldLabel>
                  <Select
                    items={TYPES_Appointment}
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      aria-invalid={fieldState.invalid}
                      className="w-full py-6 bg-white! text-black"
                    >
                      <SelectValue placeholder="Select a Type" />
                    </SelectTrigger>
                    <SelectContent className="bg-white! shadow-md border border-slate-400 text-black! h-90! overscroll-y-auto mt-40">
                      <SelectGroup>
                        <SelectLabel>Appointment Type</SelectLabel>
                        {TYPES_Appointment.map((item) => (
                          <SelectItem
                            className="mb-2"
                            key={item.value}
                            value={item.value}
                          >
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            {/* doctors */}
            <Controller
              name="doctors"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="Doctors" className="text-black">
                    Doctors
                  </FieldLabel>
                  <Select
                    items={docotorOptions}
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      aria-invalid={fieldState.invalid}
                      className="w-full py-6 bg-white! text-black"
                    >
                      <SelectValue placeholder="Select a Doctor" />
                    </SelectTrigger>
                    <SelectContent className="bg-white! shadow-md border border-slate-400 text-black! h-90! overscroll-y-auto mt-40">
                      <SelectGroup>
                        <SelectLabel>Doctors</SelectLabel>
                        {docotorOptions.map((item) => (
                          <SelectItem
                            className="mb-2"
                            key={item.value}
                            value={item.value}
                          >
                            <div className="flex gap-2">
                              <ProfileImage
                                imageUrl={item.img}
                                name={item.label}
                              />
                              <div className="text-black">
                                <p>{item.label}</p>
                                <p>{item.specialization}</p>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            {/* Date and Time */}
            <div className="flex items-center gap-2 flex-wrap lg:flex-nowrap">
              {/* Date */}
              <Controller
                control={form.control}
                name="date"
                render={({ field, fieldState }) => (
                  <Field className="w-full" data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="date" className="text-black">
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
                              <div className="flex items-center justify-between w-full">
                                <span>Pick a date</span>
                                <Calendar1 className="size-5" />
                              </div>
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
                           disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                        />
                      </PopoverContent>
                    </Popover>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              {/* Timer */}
              <Controller
                name="time"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="Timers" className="text-black">
                      Timers
                    </FieldLabel>
                    <Select
                      items={timerOptions}
                      name={field.name}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger
                        aria-invalid={fieldState.invalid}
                        className="w-full py-6 bg-white! text-black"
                      >
                        <SelectValue placeholder="Select a Timer" />
                      </SelectTrigger>
                      <SelectContent className="bg-white! shadow-md border border-slate-400 text-black! h-90! overscroll-y-auto mt-40">
                        <SelectGroup>
                          <SelectLabel>Timers</SelectLabel>
                          {timerOptions.map((item) => (
                            <SelectItem
                              className="mb-2"
                              key={item.value}
                              value={item.value}
                            >
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
            {/*Note*/}
            <div className="w-full">
              <Controller
                control={form.control}
                name="note"
                render={({ field, fieldState }) => (
                  <Field aria-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="note" className="text-black">
                      Note
                    </FieldLabel>
                    <InputGroup className="overflow-hidden">
                      <InputGroupTextarea
                        {...field}
                        id="note"
                        rows={6}
                        className="w-full bg-white! text-black!  "
                        aria-invalid={fieldState.invalid}
                        placeholder="Enter your note"
                      />
                    </InputGroup>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
          </form>
          <Field orientation="horizontal">
            <Button
              disabled={loading}
              variant="secondary"
              type="submit"
              form="bookAppointment"
              className="hover:bg-black/40 cursor-pointer w-full py-5"
            >
              {loading ? <Spinner fontSize={3} /> : "Submit"}
            </Button>
          </Field>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default BookAppointment;

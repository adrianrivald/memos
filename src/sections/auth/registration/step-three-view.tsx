import { ChangeEvent, Fragment, useEffect, useRef, useState } from "react";
import {
  businesses,
  profesions,
  spesialisData,
} from "../../../components/constants/constants";
import { uploadImage } from "../../../services/utils/uploadImage";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { Button, Card } from "../../../components/uiComponent";
import { Listbox, Transition } from "@headlessui/react";
import { ArrowDownIcon } from "../../../components/iconsComponent";
import { useNavigate } from "react-router-dom";
import { useRegistrationFormStore } from "../../../stores/registration/useRegistrationFormStore";

interface SelectProps {
  label: string;
  id: string;
}
interface ProfesionProps {
  label: string;
  id: number;
}
export function ProfesionForm() {
  const navigate = useNavigate();
  const { formData, setFormData } = useRegistrationFormStore();
  const { register, handleSubmit, formState, watch, setValue, control } =
    useForm<any>();
  const form = useRef(null) as any;
  const [selectedProfesion, setSelectedProfesion] = useState<ProfesionProps>();
  const [selectedSpesialis, setSelectedSpesialis] = useState<ProfesionProps>();
  const [selectedBusiness, setSelectedBusiness] = useState<SelectProps>();

  // Wilayah
  const [provinceList, setProvinceList] = useState<any[]>([]);
  const [cityList, setCityList] = useState<any[]>([]);
  const [districtList, setDistrictList] = useState<any[]>([]);
  const [villageList, setVillageList] = useState<any[]>([]);

  // Selected Wilayah
  const [selectedProvince, setSelectedProvince] = useState<
    Omit<SelectProps, "label"> & { name: string }
  >();
  const [selectedCity, setSelectedCity] = useState<
    Omit<SelectProps, "label"> & { name: string; province_id: number }
  >();
  const [selectedDistrict, setSelectedDistrict] = useState<
    Omit<SelectProps, "label"> & { name: string; city_id: number }
  >();
  const [selectedVillage, setSelectedVillage] = useState<
    Omit<SelectProps, "label"> & { name: string; district_id: number }
  >();

  useEffect(() => {
    setSelectedProfesion(
      profesions?.find((item) => item?.id === formData["profession_id"])
    );
    if (formData?.profession_id) {
      setValue(
        "profession_id",
        profesions?.find((item) => item?.id === formData["profession_id"]),
        { shouldValidate: true }
      );
    }
    setSelectedSpesialis(
      spesialisData?.find((item) => item?.id === formData["smf_id"])
    );
    if (formData?.smf_id) {
      setValue(
        "smf_id",
        spesialisData?.find((item) => item?.id === formData["smf_id"]),
        { shouldValidate: true }
      );
    }
    setSelectedBusiness(
      businesses?.find((item) => item?.id === formData["facility_type"])
    );
    if (formData?.facility_type) {
      setValue(
        "facility_type",
        businesses?.find((item) => item?.id === formData["facility_type"]),
        { shouldValidate: true }
      );
    }
  }, []);

  useEffect(() => {
    setSelectedProvince(
      provinceList?.find((item: any) => item?.id === formData["province"])
    );
    setSelectedCity(
      cityList?.find((item: any) => item?.id === formData["city"])
    );
    setSelectedDistrict(
      districtList?.find((item: any) => item?.id === formData["sub_district"])
    );
    setSelectedVillage(
      villageList?.find((item: any) => item?.id === formData["village"])
    );
  });

  useEffect(() => {
    if (provinceList?.length > 0 && formData?.province) {
      setValue(
        "province",
        provinceList?.find((item) => item?.id === formData["province"]),
        { shouldValidate: true }
      );
    }
  }, [provinceList]);

  useEffect(() => {
    if (cityList?.length > 0 && formData?.city) {
      setValue(
        "city",
        cityList?.find((item) => item?.id === formData["city"]),
        { shouldValidate: true }
      );
    }
  }, [cityList]);

  useEffect(() => {
    if (districtList?.length > 0 && formData?.sub_district) {
      setValue(
        "sub_district",
        districtList?.find((item) => item?.id === formData["sub_district"]),
        { shouldValidate: true }
      );
    }
  }, [districtList]);

  useEffect(() => {
    if (villageList?.length > 0 && formData?.village) {
      setValue(
        "village",
        villageList?.find((item) => item?.id === formData["village"]),
        { shouldValidate: true }
      );
    }
  }, [villageList]);

  const getProvinces = async () => {
    await fetch(
      `https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json`
    )
      .then((response) => response.json())
      .then((provinces) => setProvinceList(provinces));
  };

  const getCities = async () => {
    await fetch(
      `https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${
        watch("province")?.id
      }.json`
    )
      .then((response) => response.json())
      .then((regencies) => setCityList(regencies));
  };

  const getDistricts = async () => {
    await fetch(
      `https://www.emsifa.com/api-wilayah-indonesia/api/districts/${
        watch("city")?.id
      }.json`
    )
      .then((response) => response.json())
      .then((districts) => setDistrictList(districts));
  };

  const getVillages = async () => {
    await fetch(
      `https://www.emsifa.com/api-wilayah-indonesia/api/villages/${
        watch("sub_district")?.id
      }.json`
    )
      .then((response) => response.json())
      .then((villages) => setVillageList(villages));
  };

  useEffect(() => {
    getProvinces();
  }, []);

  useEffect(() => {
    if (watch("province") || selectedProvince) {
      getCities();
    }
  }, [watch("province"), selectedProvince]);

  useEffect(() => {
    if (watch("city") || selectedCity) {
      getDistricts();
    }
  }, [watch("city"), selectedCity]);

  useEffect(() => {
    if (watch("sub_district") || selectedDistrict) {
      getVillages();
    }
  }, [watch("sub_district"), selectedDistrict]);

  const onPreviousStep = () => {
    navigate("/registration/step/2");
  };

  const handleSTRNoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];

      const imageData = new FormData();
      imageData.append("file", file as unknown as File);
      uploadImage(imageData).then((res) => {
        const { file_url } = res;
        setFormData({
          str_photo: file_url,
        });
      });
      setValue("str_photo", file?.name, { shouldValidate: true });
      setFormData({
        str_photo_name: file?.name,
      });
    }
  };

  const handleFileFotoUsahaChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];

      const imageData = new FormData();
      imageData.append("file", file as unknown as File);
      uploadImage(imageData).then((res) => {
        const { file_url } = res;
        setFormData({
          facility_photo: file_url,
        });
      });
      setValue("facility_photo", file?.name, { shouldValidate: true });
      setFormData({
        facility_photo_name: file?.name,
      });
    }
  };

  const [isSameAddress, setIsSameAddress] = useState(true);
  const onToggleSameAddress = () => {
    setIsSameAddress((prev) => !prev);
  };

  const onSubmit: SubmitHandler<any> = async () => {
    if (Object.keys(formState?.errors).length === 0) {
      navigate("/registration/summary");
    }
  };

  console.log(formData, "formdata");

  return (
    <div
      id="terms-condition"
      className={twMerge("mb-24 p-4 lg:p-16", "max-w-[1200rem] mx-auto")}
    >
      <div className="lg:mx-36">
        <form ref={form} onSubmit={handleSubmit(onSubmit)}>
          <Card>
            <div className="flex items-center gap-4 mb-2">
              <img
                onClick={onPreviousStep}
                src="/assets/icons/arrow-back.svg"
                alt="back"
                width={24}
                height={24}
                className="cursor-pointer"
              />
              {/* Heading */}
              <div className="flex flex-col gap-2">
                <h1 className="text-[24px] font-bold">Identitas Profesi</h1>
                <span className="text-[14px] text-neutral-300">
                  Langkah 3 dari 3
                </span>
              </div>
              {/* Heading */}
            </div>
            <div className="border border-t border-neutral-200 w-full mt-2" />
            <div className="flex flex-col gap-8 mt-6">
              {/* Top fields */}
              <div className="flex flex-col gap-4">
                {/* Row 1 */}
                <div className="flex flex-col lg:flex-row justify-between gap-4">
                  <div className="w-full flex flex-col gap-2">
                    <label className="text-[14px] font-medium" htmlFor="gender">
                      Profesi/Jabatan
                      <span className="text-warning">*</span>
                    </label>
                    <Controller
                      name="profession_id"
                      control={control}
                      defaultValue={selectedProfesion}
                      rules={{
                        required: {
                          value: true,
                          message: "Profesi/Jabatan wajib diisi",
                        },
                      }}
                      render={({ field }) => (
                        <Listbox
                          value={field.value}
                          onChange={(val) => {
                            setFormData({ profession_id: val?.id });
                            setValue("profession_id", val, {
                              shouldValidate: true,
                            });
                          }}
                        >
                          <div className="relative">
                            <Listbox.Button
                              className={`border relative w-full cursor-default rounded-md bg-white py-4 pl-4 pr-10 text-left focus:outline-none ${
                                formState?.errors?.profession_id
                                  ? "border-primary-500"
                                  : "border-neutral-100"
                              }`}
                            >
                              <span className="block truncate">
                                {field.value ? (
                                  field.value.label
                                ) : (
                                  <span className="text-neutral-400">
                                    Pilih Profesi/Jabatan
                                  </span>
                                )}
                              </span>
                              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                <ArrowDownIcon />
                              </span>
                            </Listbox.Button>
                            <Transition
                              as={Fragment}
                              leave="transition ease-in duration-100"
                              leaveFrom="opacity-100"
                              leaveTo="opacity-0"
                            >
                              <Listbox.Options className="z-10 absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                                {profesions.map((profesion, idx) => (
                                  <Listbox.Option
                                    key={idx}
                                    className={({ active }) =>
                                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                        active ? "bg-green-100" : ""
                                      }`
                                    }
                                    value={profesion}
                                  >
                                    {({ selected }) => (
                                      <>
                                        <span
                                          className={`block truncate ${
                                            selected
                                              ? "font-medium"
                                              : "font-normal"
                                          }`}
                                        >
                                          {profesion?.label}
                                        </span>
                                      </>
                                    )}
                                  </Listbox.Option>
                                ))}
                              </Listbox.Options>
                            </Transition>
                          </div>
                        </Listbox>
                      )}
                    />

                    {formState?.errors?.profession_id && (
                      <span className="text-primary-500">
                        {formState?.errors?.profession_id?.message as any}
                      </span>
                    )}
                  </div>
                  <div className="w-full flex flex-col gap-2">
                    <label className="text-[14px] font-medium" htmlFor="gender">
                      SMF
                      <span className="text-warning">*</span>
                    </label>

                    <Controller
                      name="smf_id"
                      control={control}
                      defaultValue={selectedSpesialis}
                      rules={{
                        required: {
                          value: true,
                          message: "SMF wajib diisi",
                        },
                      }}
                      render={({ field }) => (
                        <Listbox
                          value={field.value}
                          onChange={(val) => {
                            setFormData({ smf_id: val?.id });
                            setValue("smf_id", val, {
                              shouldValidate: true,
                            });
                          }}
                        >
                          <div className="relative">
                            <Listbox.Button
                              className={`border relative w-full cursor-default rounded-md bg-white py-4 pl-4 pr-10 text-left focus:outline-none ${
                                formState?.errors?.smf_id
                                  ? "border-primary-500"
                                  : "border-neutral-100"
                              }`}
                            >
                              <span className="block truncate">
                                {field.value ? (
                                  field.value.label
                                ) : (
                                  <span className="text-neutral-400">
                                    Pilih Spesialis
                                  </span>
                                )}
                              </span>
                              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                <ArrowDownIcon />
                              </span>
                            </Listbox.Button>
                            <Transition
                              as={Fragment}
                              leave="transition ease-in duration-100"
                              leaveFrom="opacity-100"
                              leaveTo="opacity-0"
                            >
                              <Listbox.Options className="z-10 absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                                {spesialisData.map((spesialis, idx) => (
                                  <Listbox.Option
                                    key={idx}
                                    className={({ active }) =>
                                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                        active ? "bg-green-100" : ""
                                      }`
                                    }
                                    value={spesialis}
                                  >
                                    {({ selected }) => (
                                      <>
                                        <span
                                          className={`block truncate ${
                                            selected
                                              ? "font-medium"
                                              : "font-normal"
                                          }`}
                                        >
                                          {spesialis?.label}
                                        </span>
                                      </>
                                    )}
                                  </Listbox.Option>
                                ))}
                              </Listbox.Options>
                            </Transition>
                          </div>
                        </Listbox>
                      )}
                    />
                    {formState?.errors?.smf_id && (
                      <span className="text-primary-500">
                        {formState?.errors?.smf_id?.message as any}
                      </span>
                    )}
                  </div>
                </div>

                {/* Row 2 */}
                <div className="flex items-start flex-col lg:flex-row justify-between gap-4">
                  <div className="flex flex-col gap-2 w-full">
                    <label className="text-[14px] font-medium" htmlFor="str_no">
                      No. STR Aktif
                      <span className="text-warning">*</span>
                    </label>
                    <input
                      id="str_no"
                      {...register("str_no", {
                        required: {
                          value: true,
                          message: "No. STR Aktif wajib diisi",
                        },
                      })}
                      type="text"
                      className={`rounded-[8px] p-4 border focus:outline-none ${
                        formState?.errors?.str_no
                          ? "border-primary-500"
                          : "border-neutral-100"
                      }`}
                      placeholder="Masukkan No. STR"
                      onChange={(e) => {
                        setValue("str_no", e.target.value, {
                          shouldValidate: true,
                        });
                        setFormData({ str_no: e.target.value });
                      }}
                      defaultValue={formData["str_no"]}
                    />
                    {formState?.errors?.str_no && (
                      <span className="text-primary-500">
                        {formState?.errors?.str_no?.message as any}
                      </span>
                    )}
                    <span className="text-[13px] text-neutral-300">
                      Digunakan hanya untuk keperluan verifikasi
                    </span>
                  </div>
                  <div className="flex items-start flex-col md:flex-row gap-2 w-full">
                    <div className="w-full flex flex-col gap-2">
                      <label
                        className="text-[14px] font-medium"
                        htmlFor="expires_date"
                      >
                        Tanggal Habis Berlaku
                        <span className="text-warning">*</span>
                      </label>

                      <input
                        id="expires_date"
                        {...register("expires_date", {
                          required: {
                            value: true,
                            message: "Tanggal Habis Berlaku wajib diisi",
                          },
                        })}
                        type="date"
                        className={`rounded-[8px] p-4 border focus:outline-none ${
                          formState?.errors?.expires_date
                            ? "border-primary-500"
                            : "border-neutral-100"
                        }`}
                        placeholder="Tanggal Habis Berlaku"
                        onChange={(e) => {
                          setValue("expires_date", e.target.value, {
                            shouldValidate: true,
                          });
                          setFormData({ expires_date: e.target.value });
                        }}
                        defaultValue={formData["expires_date"]}
                      />
                      {formState?.errors?.expires_date && (
                        <span className="text-primary-500">
                          {formState?.errors?.expires_date?.message as any}
                        </span>
                      )}
                    </div>
                    <div className="w-full flex flex-col gap-2">
                      <label
                        className="text-[14px] font-medium"
                        htmlFor="str_photo"
                      >
                        Unggah STR Aktif
                        <span className="text-warning">*</span>
                      </label>
                      <div
                        className={`relative rounded-[8px] p-4 border border-neutral-100 flex items-center gap-2 ${
                          formState.errors?.str_photo
                            ? "border-primary-500"
                            : "border-neutral-100"
                        }`}
                      >
                        <input
                          {...register("str_photo", {
                            required: {
                              value: true,
                              message: "STR Aktif wajib diisi",
                            },
                          })}
                          type="text"
                          className="focus:outline-none w-full"
                          placeholder="Unggah No. STR"
                          value={formData?.str_photo_name}
                          readOnly
                        />
                        <input
                          type="file"
                          hidden
                          id="str_photo"
                          onChange={handleSTRNoChange}
                        />
                        <label
                          htmlFor="str_photo"
                          className="text-link cursor-pointer"
                        >
                          Unggah
                        </label>
                      </div>

                      {formState?.errors?.str_photo && (
                        <span className="text-primary-500">
                          {formState?.errors?.str_photo?.message as any}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-t-2 border-dashed border-neutral-400 w-full h-1"></div>

              {/* Bottom fields */}

              {/* Row 4 */}
              <div className="flex flex-col lg:flex-row justify-between gap-4">
                <div className="flex flex-col gap-2 lg:w-full">
                  <label
                    className="text-[14px] font-medium"
                    htmlFor="facility_organization_name"
                  >
                    Organisasi
                    <span className="text-warning">*</span>
                  </label>
                  <input
                    id="facility_organization_name"
                    {...register("facility_organization_name", {
                      required: {
                        value: true,
                        message: "Organisasi wajib diisi",
                      },
                    })}
                    type="text"
                    className={`rounded-[8px] p-4 border focus:outline-none ${
                      formState?.errors?.facility_organization_name
                        ? "border-primary-500"
                        : "border-neutral-100"
                    }`}
                    placeholder="Masukkan nama organisasi"
                    onChange={(e) => {
                      setValue("facility_organization_name", e.target.value, {
                        shouldValidate: true,
                      });
                      setFormData({
                        facility_organization_name: e.target.value,
                      });
                    }}
                    defaultValue={formData["facility_organization_name"]}
                  />
                  {formState?.errors?.facility_organization_name && (
                    <span className="text-primary-500">
                      {
                        formState?.errors?.facility_organization_name
                          ?.message as any
                      }
                    </span>
                  )}
                </div>
                <div className="w-full flex flex-col gap-2">
                  <label
                    className="text-[14px] font-medium"
                    htmlFor="facility_name"
                  >
                    Nama Klinik/Usaha
                    <span className="text-warning">*</span>
                  </label>
                  <input
                    id="facility_name"
                    {...register("facility_name", {
                      required: {
                        value: true,
                        message: "Nama Klinik/Usha wajib diisi",
                      },
                    })}
                    type="text"
                    className={`rounded-[8px] p-4 border focus:outline-none ${
                      formState?.errors?.facility_name
                        ? "border-primary-500"
                        : "border-neutral-100"
                    }`}
                    placeholder="Masukkan nama klinik/usaha"
                    onChange={(e) => {
                      setValue("facility_name", e.target.value, {
                        shouldValidate: true,
                      });
                      setFormData({ facility_name: e.target.value });
                    }}
                    defaultValue={formData["facility_name"]}
                  />
                  {formState?.errors?.facility_name && (
                    <span className="text-primary-500">
                      {formState?.errors?.facility_name?.message as any}
                    </span>
                  )}
                </div>
              </div>

              {/* Row 5 */}
              <div className="flex flex-col lg:flex-row justify-between gap-4">
                <div className="flex flex-col gap-2 lg:w-full">
                  <label
                    className="text-[14px] font-medium"
                    htmlFor="organization"
                  >
                    Jenis Usaha
                    <span className="text-warning">*</span>
                  </label>

                  <Controller
                    name="facility_type"
                    control={control}
                    defaultValue={selectedBusiness}
                    rules={{
                      required: {
                        value: true,
                        message: "Jenis Usaha wajib diisi",
                      },
                    }}
                    render={({ field }) => (
                      <Listbox
                        value={field.value}
                        onChange={(val) => {
                          setFormData({ facility_type: val?.id });
                          setValue("facility_type", val, {
                            shouldValidate: true,
                          });
                        }}
                      >
                        <div className="relative">
                          <Listbox.Button
                            className={`border relative w-full cursor-default rounded-md bg-white py-4 pl-4 pr-10 text-left focus:outline-none ${
                              formState?.errors?.facility_type
                                ? "border-primary-500"
                                : "border-neutral-100"
                            }`}
                          >
                            <span className="block truncate">
                              {field.value ? (
                                field.value.label
                              ) : (
                                <span className="text-neutral-400">
                                  Pilih Jenis Usaha
                                </span>
                              )}
                            </span>
                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                              <ArrowDownIcon />
                            </span>
                          </Listbox.Button>
                          <Transition
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                          >
                            <Listbox.Options className="z-10 absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                              {businesses.map((business, idx) => (
                                <Listbox.Option
                                  key={idx}
                                  className={({ active }) =>
                                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                      active ? "bg-green-100" : ""
                                    }`
                                  }
                                  value={business}
                                >
                                  {({ selected }) => (
                                    <>
                                      <span
                                        className={`block truncate ${
                                          selected
                                            ? "font-medium"
                                            : "font-normal"
                                        }`}
                                      >
                                        {business?.label}
                                      </span>
                                    </>
                                  )}
                                </Listbox.Option>
                              ))}
                            </Listbox.Options>
                          </Transition>
                        </div>
                      </Listbox>
                    )}
                  />
                  {formState?.errors?.facility_type && (
                    <span className="text-primary-500">
                      {formState?.errors?.facility_type?.message as any}
                    </span>
                  )}
                </div>

                <div className="w-full flex flex-col gap-2">
                  <label
                    className="text-[14px] font-medium"
                    htmlFor="identity_photo"
                  >
                    Unggah Foto Tempat Klinik/Usaha (Opsional)
                  </label>
                  <div
                    className={`relative rounded-[8px] p-4 border border-neutral-100 flex items-center gap-2 ${
                      formState.errors?.facility_photo
                        ? "border-primary-500"
                        : "border-neutral-100"
                    }`}
                  >
                    <input
                      {...register("facility_photo")}
                      type="text"
                      className="focus:outline-none w-full"
                      placeholder="Unggah Foto Tempat Praktek"
                      value={formData?.facility_photo_name}
                      readOnly
                    />
                    {/* {fotoKtp?.name} */}
                    <input
                      type="file"
                      hidden
                      id="identity_photo"
                      onChange={handleFileFotoUsahaChange}
                    />
                    <label
                      htmlFor="identity_photo"
                      className="text-link cursor-pointer"
                    >
                      Unggah
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  className="accent-green-500 w-4 h-4"
                  id="same_address"
                  type="checkbox"
                  checked={isSameAddress}
                  onChange={onToggleSameAddress}
                />

                <label htmlFor="same_address" className="cursor-pointer">
                  Alamat sama dengan alamat pribadi
                </label>
              </div>

              {!isSameAddress && (
                <>
                  <div className="border-t-2 border-dashed border-neutral-400 w-full h-1"></div>

                  {/* Bottom fields */}
                  <div className="flex flex-col gap-4">
                    {/* Row 5 */}
                    <div className="flex flex-col lg:flex-row justify-between gap-4">
                      <div className="w-full flex flex-col gap-2">
                        <label
                          className="text-[14px] font-medium"
                          htmlFor="province"
                        >
                          Provinsi <span className="text-warning">*</span>
                        </label>

                        <Controller
                          name="province"
                          control={control}
                          defaultValue={selectedProvince}
                          rules={{
                            required: {
                              value: true,
                              message: "Provinsi wajib diisi",
                            },
                          }}
                          render={({ field }) => (
                            <Listbox
                              value={field.value}
                              onChange={(val) => {
                                setFormData({ province: val?.id });
                                setValue("province", val, {
                                  shouldValidate: true,
                                });
                              }}
                            >
                              <div className="relative">
                                <Listbox.Button
                                  className={`border relative w-full cursor-default rounded-md bg-white py-4 pl-4 pr-10 text-left focus:outline-none ${
                                    formState?.errors?.province
                                      ? "border-primary-500"
                                      : "border-neutral-100"
                                  }`}
                                >
                                  {" "}
                                  <span className="block truncate">
                                    {field.value ? (
                                      field.value.name
                                    ) : (
                                      <span className="text-neutral-400">
                                        Masukkan Provinsi
                                      </span>
                                    )}
                                  </span>
                                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                    <ArrowDownIcon />
                                  </span>
                                </Listbox.Button>
                                <Transition
                                  as={Fragment}
                                  leave="transition ease-in duration-100"
                                  leaveFrom="opacity-100"
                                  leaveTo="opacity-0"
                                >
                                  <Listbox.Options className="z-10 absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                                    {provinceList.map((province, idx) => (
                                      <Listbox.Option
                                        key={idx}
                                        className={({ active }) =>
                                          `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                            active ? "bg-green-100" : ""
                                          }`
                                        }
                                        value={province}
                                      >
                                        {({ selected }) => (
                                          <>
                                            <span
                                              className={`block truncate ${
                                                selected
                                                  ? "font-medium"
                                                  : "font-normal"
                                              }`}
                                            >
                                              {province?.name}
                                            </span>
                                          </>
                                        )}
                                      </Listbox.Option>
                                    ))}
                                  </Listbox.Options>
                                </Transition>
                              </div>
                            </Listbox>
                          )}
                        />

                        {formState?.errors?.province && (
                          <span className="text-primary-500">
                            {formState?.errors?.province?.message as any}
                          </span>
                        )}
                      </div>
                      <div className="w-full flex flex-col gap-2">
                        <label
                          className="text-[14px] font-medium"
                          htmlFor="city"
                        >
                          Kota/Kabupaten <span className="text-warning">*</span>
                        </label>
                        <Controller
                          name="city"
                          control={control}
                          defaultValue={selectedCity}
                          rules={{
                            required: {
                              value: true,
                              message: "Kota wajib diisi",
                            },
                          }}
                          render={({ field }) => (
                            <Listbox
                              value={field.value}
                              onChange={(val) => {
                                setFormData({ city: val?.id });
                                setValue("city", val, {
                                  shouldValidate: true,
                                });
                              }}
                            >
                              <div className="relative">
                                <Listbox.Button
                                  className={`border relative w-full cursor-default rounded-md bg-white py-4 pl-4 pr-10 text-left focus:outline-none ${
                                    formState?.errors?.city
                                      ? "border-primary-500"
                                      : "border-neutral-100"
                                  }`}
                                >
                                  <span className="block truncate">
                                    {field.value ? (
                                      field.value.name
                                    ) : (
                                      <span className="text-neutral-400">
                                        Masukkan Kota/Kabupaten
                                      </span>
                                    )}
                                  </span>
                                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                    <ArrowDownIcon />
                                  </span>
                                </Listbox.Button>
                                <Transition
                                  as={Fragment}
                                  leave="transition ease-in duration-100"
                                  leaveFrom="opacity-100"
                                  leaveTo="opacity-0"
                                >
                                  <Listbox.Options className="z-10 absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                                    {cityList.map((city, idx) => (
                                      <Listbox.Option
                                        key={idx}
                                        className={({ active }) =>
                                          `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                            active ? "bg-green-100" : ""
                                          }`
                                        }
                                        value={city}
                                      >
                                        {({ selected }) => (
                                          <>
                                            <span
                                              className={`block truncate ${
                                                selected
                                                  ? "font-medium"
                                                  : "font-normal"
                                              }`}
                                            >
                                              {city?.name}
                                            </span>
                                          </>
                                        )}
                                      </Listbox.Option>
                                    ))}
                                  </Listbox.Options>
                                </Transition>
                              </div>
                            </Listbox>
                          )}
                        />

                        {formState?.errors?.city && (
                          <span className="text-primary-500">
                            {formState?.errors?.city?.message as any}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Row 6 */}
                    <div className="flex flex-col lg:flex-row justify-between gap-4">
                      <div className="w-full flex flex-col gap-2">
                        <label
                          className="text-[14px] font-medium"
                          htmlFor="district"
                        >
                          Kecamatan <span className="text-warning">*</span>
                        </label>
                        <Controller
                          name="sub_district"
                          control={control}
                          defaultValue={selectedDistrict}
                          rules={{
                            required: {
                              value: true,
                              message: "Kecamatan wajib diisi",
                            },
                          }}
                          render={({ field }) => (
                            <Listbox
                              value={field.value}
                              onChange={(val) => {
                                setFormData({ sub_district: val?.id });
                                setValue("sub_district", val, {
                                  shouldValidate: true,
                                });
                              }}
                            >
                              <div className="relative">
                                <Listbox.Button
                                  className={`border relative w-full cursor-default rounded-md bg-white py-4 pl-4 pr-10 text-left focus:outline-none ${
                                    formState?.errors?.sub_district
                                      ? "border-primary-500"
                                      : "border-neutral-100"
                                  }`}
                                >
                                  <span className="block truncate">
                                    {field.value ? (
                                      field.value.name
                                    ) : (
                                      <span className="text-neutral-400">
                                        Masukkan Kecamatan
                                      </span>
                                    )}
                                  </span>
                                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                    <ArrowDownIcon />
                                  </span>
                                </Listbox.Button>
                                <Transition
                                  as={Fragment}
                                  leave="transition ease-in duration-100"
                                  leaveFrom="opacity-100"
                                  leaveTo="opacity-0"
                                >
                                  <Listbox.Options className="z-10 absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                                    {districtList.map((sub_district, idx) => (
                                      <Listbox.Option
                                        key={idx}
                                        className={({ active }) =>
                                          `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                            active ? "bg-green-100" : ""
                                          }`
                                        }
                                        value={sub_district}
                                      >
                                        {({ selected }) => (
                                          <>
                                            <span
                                              className={`block truncate ${
                                                selected
                                                  ? "font-medium"
                                                  : "font-normal"
                                              }`}
                                            >
                                              {sub_district?.name}
                                            </span>
                                          </>
                                        )}
                                      </Listbox.Option>
                                    ))}
                                  </Listbox.Options>
                                </Transition>
                              </div>
                            </Listbox>
                          )}
                        />

                        {formState?.errors?.sub_district && (
                          <span className="text-primary-500">
                            {formState?.errors?.sub_district?.message as any}
                          </span>
                        )}
                      </div>
                      <div className="w-full flex flex-col gap-2">
                        <label
                          className="text-[14px] font-medium"
                          htmlFor="village"
                        >
                          Kelurahan <span className="text-warning">*</span>
                        </label>

                        <Controller
                          name="village"
                          control={control}
                          defaultValue={selectedVillage}
                          rules={{
                            required: {
                              value: true,
                              message: "Kelurahan wajib diisi",
                            },
                          }}
                          render={({ field }) => (
                            <Listbox
                              value={field.value}
                              onChange={(val) => {
                                setFormData({ village: val?.id });
                                setValue("village", val, {
                                  shouldValidate: true,
                                });
                              }}
                            >
                              <div className="relative">
                                <Listbox.Button
                                  className={`border relative w-full cursor-default rounded-md bg-white py-4 pl-4 pr-10 text-left focus:outline-none ${
                                    formState?.errors?.village
                                      ? "border-primary-500"
                                      : "border-neutral-100"
                                  }`}
                                >
                                  <span className="block truncate">
                                    {field.value ? (
                                      field.value.name
                                    ) : (
                                      <span className="text-neutral-400">
                                        Masukkan Kelurahan
                                      </span>
                                    )}
                                  </span>
                                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                    <ArrowDownIcon />
                                  </span>
                                </Listbox.Button>
                                <Transition
                                  as={Fragment}
                                  leave="transition ease-in duration-100"
                                  leaveFrom="opacity-100"
                                  leaveTo="opacity-0"
                                >
                                  <Listbox.Options className="z-10 absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                                    {villageList.map((village, idx) => (
                                      <Listbox.Option
                                        key={idx}
                                        className={({ active }) =>
                                          `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                            active ? "bg-green-100" : ""
                                          }`
                                        }
                                        value={village}
                                      >
                                        {({ selected }) => (
                                          <>
                                            <span
                                              className={`block truncate ${
                                                selected
                                                  ? "font-medium"
                                                  : "font-normal"
                                              }`}
                                            >
                                              {village?.name}
                                            </span>
                                          </>
                                        )}
                                      </Listbox.Option>
                                    ))}
                                  </Listbox.Options>
                                </Transition>
                              </div>
                            </Listbox>
                          )}
                        />

                        {formState?.errors?.village && (
                          <span className="text-primary-500">
                            {formState?.errors?.village?.message as any}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Row 7 */}
                    <div className="flex flex-col lg:flex-row justify-between gap-4">
                      <div className="flex flex-col gap-2 w-full">
                        <label
                          className="text-[14px] font-medium"
                          htmlFor="street_address"
                        >
                          Alamat
                          <span className="text-warning">*</span>
                        </label>
                        <input
                          id="street_address"
                          {...register("street_address", {
                            required: {
                              value: true,
                              message: "Alamat wajib diisi",
                            },
                          })}
                          type="text"
                          className={`rounded-[8px] p-4 border focus:outline-none ${
                            formState?.errors?.street_address
                              ? "border-primary-500"
                              : "border-neutral-100"
                          }`}
                          placeholder="Masukkan Alamat"
                          onChange={(e) => {
                            setValue("street_address", e.target.value, {
                              shouldValidate: true,
                            });
                            setFormData({ street_address: e.target.value });
                          }}
                          defaultValue={formData["street_address"]}
                        />

                        {formState?.errors?.street_address && (
                          <span className="text-primary-500">
                            {formState?.errors?.street_address?.message as any}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col md:flex-row items-center gap-2 lg:w-full">
                        <div className="w-full flex flex-col gap-2">
                          <label
                            className="text-[14px] font-medium"
                            htmlFor="detail_note"
                          >
                            Detail Alamat (Optional){" "}
                          </label>
                          <input
                            id="detail_note"
                            {...register("detail_note", { required: false })}
                            type="text"
                            className="rounded-[8px] p-4 border border-neutral-100 focus:outline-none"
                            placeholder="Detail Alamat, No. Lantai"
                            onChange={(e) =>
                              setFormData({ detail_note: e.target.value })
                            }
                            defaultValue={formData["detail_note"]}
                          />
                        </div>
                        <div className="w-full flex flex-col gap-2">
                          <label
                            className="text-[14px] font-medium"
                            htmlFor="house_no"
                          >
                            No. Rumah (Optional){" "}
                          </label>
                          <input
                            id="house_no"
                            {...register("house_no")}
                            type="text"
                            className="rounded-[8px] p-4 border border-neutral-100 focus:outline-none"
                            placeholder="No. Rumah"
                            onChange={(e) =>
                              setFormData({ house_no: e.target.value })
                            }
                            defaultValue={formData["house_no"]}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Row 8 */}
                    <div className="flex flex-col lg:flex-row justify-between gap-4">
                      <div className="flex flex-col gap-2 lg:w-full">
                        <label
                          className="text-[14px] font-medium"
                          htmlFor="postal_code"
                        >
                          Kode Pos
                          <span className="text-warning">*</span>
                        </label>
                        <input
                          id="postal_code"
                          {...register("postal_code", {
                            required: {
                              value: true,
                              message: "Kode pos wajib diisi",
                            },
                          })}
                          type="text"
                          className={`rounded-[8px] p-4 border focus:outline-none ${
                            formState?.errors?.postal_code
                              ? "border-primary-500"
                              : "border-neutral-100"
                          }`}
                          placeholder="Masukkan Kode Pos"
                          onChange={(e) => {
                            setValue("postal_code", e.target.value, {
                              shouldValidate: true,
                            });
                            setFormData({ postal_code: e.target.value });
                          }}
                          defaultValue={formData["postal_code"]}
                        />
                        {formState?.errors?.postal_code && (
                          <span className="text-primary-500">
                            {formState?.errors?.postal_code?.message as any}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col md:flex-row items-center gap-2 lg:w-full">
                        <div className="w-full flex flex-col gap-2">
                          <label
                            className="text-[14px] font-medium"
                            htmlFor="rt_no"
                          >
                            RT
                          </label>
                          <input
                            id="rt_no"
                            {...register("rt_no", { required: false })}
                            type="text"
                            className="rounded-[8px] p-4 border border-neutral-100 focus:outline-none"
                            placeholder="Masukkan RT"
                            onChange={(e) =>
                              setFormData({ rt_no: e.target.value })
                            }
                            defaultValue={formData["rt_no"]}
                          />
                        </div>
                        <div className="w-full flex flex-col gap-2">
                          <label
                            className="text-[14px] font-medium"
                            htmlFor="rw_no"
                          >
                            RW
                          </label>
                          <input
                            id="rw_no"
                            {...register("rw_no", { required: false })}
                            type="text"
                            className="rounded-[8px] p-4 border border-neutral-100 focus:outline-none"
                            placeholder="Masukkan RW"
                            onChange={(e) =>
                              setFormData({ rw_no: e.target.value })
                            }
                            defaultValue={formData["rw_no"]}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Row 9 */}
                    <div className="flex flex-col lg:flex-row justify-between gap-4">
                      <div className="w-full flex flex-col gap-2">
                        <label
                          className="text-[14px] font-medium"
                          htmlFor="telp"
                        >
                          No. Telp
                          {/* <span className="text-warning">*</span> */}
                        </label>
                        <div className="relative rounded-[8px] p-4 border border-neutral-100 flex items-center gap-2">
                          <span>021</span>
                          <input
                            id="telp"
                            {...register("telp", { required: false })}
                            type="number"
                            min={0}
                            className="focus:outline-none"
                            placeholder="Masukkan No. Telp"
                            onChange={(e) =>
                              setFormData({ telp: e.target.value })
                            }
                            defaultValue={formData["telp"]}
                          />
                        </div>
                      </div>
                      <div className="w-full flex flex-col gap-2">
                        <label
                          className="text-[14px] font-medium"
                          htmlFor="pinpoint"
                        >
                          Pinpoint (Optional)
                          {/* <span className="text-warning">*</span> */}
                        </label>
                        <input
                          id="pinpoint"
                          {...register("pinpoint")}
                          type="text"
                          onChange={(e) => {
                            setValue("full_name", e.target.value, {
                              shouldValidate: true,
                            });
                            setFormData({ full_name: e.target.value });
                          }}
                          className={`rounded-[8px] p-4 border focus:outline-none`}
                          placeholder="Pinpoint"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </Card>
          <Card className="mt-8">
            <Button
              type="submit"
              isClinix
              isPrimary
              className="w-full"
              title="Simpan"
            />
          </Card>
        </form>
      </div>
    </div>
  );
}

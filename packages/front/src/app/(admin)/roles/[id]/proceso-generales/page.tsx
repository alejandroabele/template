"use client";

import Form from "@/components/forms/role-proceso-general-form";
import React from "react";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);

  return (
    <>
      <Form roleId={Number(id)} />
    </>
  );
}

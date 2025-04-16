
import React, { useEffect } from "react";
import { PublicBookingPage } from "@/components/booking/PublicBookingPage";
import { useParams } from "react-router-dom";

const PublicBooking = () => {
  const { consultantId } = useParams<{ consultantId: string }>();
  
  useEffect(() => {
    // Set page title
    document.title = `Запись на консультацию | ${consultantId || "Консультант"}`;
  }, [consultantId]);

  return (
    <div className="min-h-screen bg-background py-8">
      <PublicBookingPage />
    </div>
  );
};

export default PublicBooking;

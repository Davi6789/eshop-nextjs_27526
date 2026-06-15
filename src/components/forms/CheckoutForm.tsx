// src/components/forms/CheckoutForm.tsx - PayPal Integration

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkoutSchema } from "@/lib/validations/checkout";
import { useCart } from "@/context/CartContext";
import PayPalButton from "@/components/ui/PayPalButton";

interface CheckoutFormProps {
  onSubmitSuccess: (orderId: string, orderNumber: string) => void;
}

export default function CheckoutForm({ onSubmitSuccess }: CheckoutFormProps) {
  const router = useRouter();
  const { items, getDiscountedTotal, getTotalPrice, appliedCoupon, clearCart } =
    useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [tempOrderId, setTempOrderId] = useState("");
  const [tempOrderNumber, setTempOrderNumber] = useState("");

  const {
  register,
  handleSubmit,
  watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
    paymentMethod: "paypal",
    differentBillingAddress: false,
    subscribeNewsletter: false,
    acceptTerms: false,
    country: "Deutschland",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    street: "",
    houseNumber: "",
    zipCode: "",
    city: "",
    billingStreet: "",
    billingHouseNumber: "",
    billingZipCode: "",
    billingCity: "",
    billingCountry: "",
  }
});
  const differentBillingAddress = watch("differentBillingAddress");
  const paymentMethod = watch("paymentMethod");

  const totalAmount = getDiscountedTotal();

  // Bei erfolgreicher Bestellung (vor PayPal)
  const handleOrderCreated = (orderId: string, orderNumber: string) => {
    setTempOrderId(orderId);
    setTempOrderNumber(orderNumber);
    if (paymentMethod !== "paypal") {
      clearCart();
      onSubmitSuccess(orderId, orderNumber);
    }
  };

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    setServerError("");

    try {
      const totalAmount = getDiscountedTotal();
      const discountAmount = getTotalPrice() - totalAmount;

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderData: data,
          items: items,
          totalAmount: totalAmount,
          discountAmount: discountAmount,
          appliedCoupon: appliedCoupon,
          paymentMethod: data.paymentMethod,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Fehler bei der Bestellung");
      }

      // Bestelldaten für PayPal speichern
      handleOrderCreated(result.orderId, result.orderNumber);
    } catch (err: any) {
      setServerError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {serverError && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 dark:text-red-400">{serverError}</p>
        </div>
      )}

      {/* Kundendaten */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Deine Daten
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Vorname *
            </label>
            <input
              {...register("firstName")}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
            {errors.firstName && (
              <p className="text-sm text-red-600 mt-1">
                {errors.firstName.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nachname *
            </label>
            <input
              {...register("lastName")}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
            {errors.lastName && (
              <p className="text-sm text-red-600 mt-1">
                {errors.lastName.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email *
            </label>
            <input
              type="email"
              {...register("email")}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
            {errors.email && (
              <p className="text-sm text-red-600 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Telefon (optional)
            </label>
            <input
              {...register("phone")}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Lieferadresse */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Lieferadresse
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Straße *
            </label>
            <input
              {...register("street")}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="z.B. Hauptstraße"
            />
            {errors.street && (
              <p className="text-sm text-red-600 mt-1">
                {errors.street.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Hausnummer *
            </label>
            <input
              {...register("houseNumber")}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="z.B. 123"
            />
            {errors.houseNumber && (
              <p className="text-sm text-red-600 mt-1">
                {errors.houseNumber.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              PLZ *
            </label>
            <input
              {...register("zipCode")}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="z.B. 12345"
            />
            {errors.zipCode && (
              <p className="text-sm text-red-600 mt-1">
                {errors.zipCode.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Stadt *
            </label>
            <input
              {...register("city")}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
            {errors.city && (
              <p className="text-sm text-red-600 mt-1">{errors.city.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Land *
            </label>
            <select
              {...register("country")}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="Deutschland">Deutschland</option>
              <option value="Österreich">Österreich</option>
              <option value="Schweiz">Schweiz</option>
            </select>
            {errors.country && (
              <p className="text-sm text-red-600 mt-1">
                {errors.country.message}
              </p>
            )}
          </div>
        </div>

        {/* Unterschiedliche Rechnungsadresse */}
        <div className="mt-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              {...register("differentBillingAddress")}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Abweichende Rechnungsadresse
            </span>
          </label>
        </div>

        {/* Rechnungsadresse (optional) */}
        {differentBillingAddress && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-3">
              Rechnungsadresse
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <input
                  {...register("billingStreet")}
                  placeholder="Straße"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <input
                  {...register("billingHouseNumber")}
                  placeholder="Hausnummer"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <input
                  {...register("billingZipCode")}
                  placeholder="PLZ"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <input
                  {...register("billingCity")}
                  placeholder="Stadt"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <input
                  {...register("billingCountry")}
                  placeholder="Land"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Zahlungsmethode */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Zahlungsmethode
        </h2>

        <div className="space-y-3">
          <label className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
            <input
              type="radio"
              value="paypal"
              {...register("paymentMethod")}
              className="w-4 h-4 text-blue-600"
            />
            <div>
              <span className="font-medium">PayPal</span>
              <p className="text-sm text-gray-500">
                Sicher und schnell bezahlen
              </p>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
            <input
              type="radio"
              value="bank_transfer"
              {...register("paymentMethod")}
              className="w-4 h-4 text-blue-600"
            />
            <div>
              <span className="font-medium">Banküberweisung</span>
              <p className="text-sm text-gray-500">
                Nach Erhalt der Bestellung überweisen
              </p>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
            <input
              type="radio"
              value="credit_card"
              {...register("paymentMethod")}
              className="w-4 h-4 text-blue-600"
            />
            <div>
              <span className="font-medium">Kreditkarte</span>
              <p className="text-sm text-gray-500">
                Visa, Mastercard, American Express
              </p>
            </div>
          </label>
        </div>
        {errors.paymentMethod && (
          <p className="text-sm text-red-600 mt-2">
            {errors.paymentMethod.message}
          </p>
        )}
      </div>

      {/* Optionen & AGB */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="space-y-3">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              {...register("subscribeNewsletter")}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Ich möchte den Newsletter erhalten (optional)
            </span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              {...register("acceptTerms")}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Ich akzeptiere die{" "}
              <a href="/terms" className="text-blue-600 hover:underline">
                AGB
              </a>{" "}
              und
              <a href="/privacy" className="text-blue-600 hover:underline">
                {" "}
                Datenschutzbestimmungen
              </a>{" "}
              *
            </span>
          </label>
          {errors.acceptTerms && (
            <p className="text-sm text-red-600">{errors.acceptTerms.message}</p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting || items.length === 0}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
      >
        {isSubmitting
          ? "Wird verarbeitet..."
          : `Jetzt ${totalAmount.toFixed(2)}€ zahlungspflichtig bestellen`}
      </button>

      {/* PayPal Button - wird nur angezeigt wenn Bestellung erstellt wurde und PayPal ausgewählt ist */}
      {paymentMethod === "paypal" && tempOrderId && tempOrderNumber && (
        <div className="mt-4">
          <div className="text-center text-gray-500 mb-4">oder</div>
          <PayPalButton
            amount={totalAmount}
            orderId={tempOrderId}
            orderNumber={tempOrderNumber}
            onSuccess={() => {
              clearCart();
              router.push(
                `/success/${tempOrderId}?orderNumber=${tempOrderNumber}&payment=paypal`,
              );
            }}
            onError={(error) => setServerError(error)}
          />
        </div>
      )}
    </form>
  );
}

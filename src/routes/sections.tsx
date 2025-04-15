import { lazy, Suspense } from "react";
import { Outlet, Navigate, useRoutes } from "react-router-dom";
import { Loader } from "../components";
import { useAuth } from "../utils/auth/providers";

// ----------------------------------------------------------------------

// Unauthenticated Pages
export const SignInPage = lazy(() => import("../pages/login/index"));
export const SignUpPage = lazy(() => import("../pages/index"));
export const ForgotPasswordPage = lazy(
  () => import("../pages/forgot-password/index")
);
export const ResetPasswordPage = lazy(
  () => import("../pages/reset-password/index")
);
export const SignUpStepOnePage = lazy(
  () => import("../pages/registration/step/1")
);
export const SignUpStepTwoPage = lazy(
  () => import("../pages/registration/step/2")
);
export const SignUpStepThreePage = lazy(
  () => import("../pages/registration/step/3")
);
export const SignUpSummaryPage = lazy(
  () => import("../pages/registration/summary")
);
export const SignUpSummaryFinishPage = lazy(
  () => import("../pages/registration/summary/finish")
);

// Authenticated Pages
export const DashboardHomePage = lazy(() => import("../pages/dashboard/index"));
export const DashboardSubscriptionPage = lazy(
  () => import("../pages/dashboard/subscription/index")
);
export const DashboardSubscriptionPaymentPage = lazy(
  () => import("../pages/dashboard/subscription/payment")
);

export const DashboardSubscriptionPaymentDetailPage = lazy(
  () => import("../pages/dashboard/subscription/payment/detail")
);

export const DashboardSubscriptionPaymentSuccessPage = lazy(
  () => import("../pages/dashboard/subscription/payment/success")
);
export const DashboardSubscriptionPaymentFailedPage = lazy(
  () => import("../pages/dashboard/subscription/payment/failed")
);
export const DashboardSubscriptionPaymentInProgressPage = lazy(
  () => import("../pages/dashboard/subscription/payment/in-progress")
);

export const DashboardSubscriptionPaymentStatusPage = lazy(
  () => import("../pages/dashboard/subscription/payment/status")
);

export const WorkspacePage = lazy(() => import("../pages/workspace/[slug]"));

export const ProfilePage = lazy(() => import("../pages/profile"));

export const MasterItemPage = lazy(() =>
  import("../pages/master-item").then((mod) => ({
    default: mod.MasterItemContainer,
  }))
);

export const MasterTarifPage = lazy(() =>
  import("../pages/master-tarif").then((mod) => ({
    default: mod.MasterTarifContainer,
  }))
);

export const ItemObatListPage = lazy(() =>
  import("../pages/master-item").then((mod) => ({ default: mod.ItemObatList }))
);

export const ItemObatFormPage = lazy(() =>
  import("../pages/master-item").then((mod) => ({
    default: mod.ItemObatForm,
  }))
);

export const ItemPelayananListPage = lazy(() =>
  import("../pages/master-item").then((mod) => ({
    default: mod.ItemPelayananList,
  }))
);

export const ItemAlatKesehatanListPage = lazy(() =>
  import("../pages/master-item").then((mod) => ({
    default: mod.ItemAlatKesehatanList,
  }))
);
export const ItemAlatKesehatanFormPage = lazy(() =>
  import("../pages/master-item").then((mod) => ({
    default: mod.ItemAlatKesehatanForm,
  }))
);

const renderFallback = (
  <div className="flex items-center justify-center h-full">
    <Loader />
  </div>
);

export function Router() {
  const { isAuth } = useAuth();

  const authenticatedRoutes = useRoutes([
    {
      element: (
        <Suspense fallback={renderFallback}>
          <Outlet />
        </Suspense>
      ),
      children: [
        { path: "/", element: <DashboardHomePage />, index: true },
        {
          path: "/profile",
          element: <ProfilePage />,
        },
        {
          path: "/master-item",
          element: <MasterItemPage />,
          children: [
            {
              index: true,
              element: <ItemPelayananListPage />,
            },
            {
              path: "item-pelayanan",
              element: <ItemPelayananListPage />,
            },

            {
              path: "item-obat",
              element: <ItemObatListPage />,
            },
            {
              path: "item-obat/create",
              element: <ItemObatFormPage />,
            },
            {
              path: "item-obat/:id",
              element: <ItemObatFormPage />,
            },
            {
              path: "item-alat-kesehatan",
              element: <ItemAlatKesehatanListPage />,
            },
            {
              path: "item-alat-kesehatan/create",
              element: <ItemAlatKesehatanFormPage />,
            },
            {
              path: "item-alat-kesehatan/:id",
              element: <ItemAlatKesehatanFormPage />,
            },
          ],
        },
        {
          path: "/subscription",
          element: <DashboardSubscriptionPage />,
        },
        {
          path: "/subscription/payment",
          element: <DashboardSubscriptionPaymentPage />,
        },
        {
          path: "/subscription/payment/status/success",
          element: <DashboardSubscriptionPaymentSuccessPage />,
        },
        {
          path: "/subscription/payment/status/failed",
          element: <DashboardSubscriptionPaymentFailedPage />,
        },
        {
          path: "/subscription/payment/status/pending",
          element: <DashboardSubscriptionPaymentInProgressPage />,
        },
        {
          path: "/subscription/payment/status/:paymentId",
          element: <DashboardSubscriptionPaymentStatusPage />,
        },

        {
          path: "/subscription/payment/:subscriptionId",
          element: <DashboardSubscriptionPaymentDetailPage />,
        },

        {
          path: "/workspace/:workspaceId",
          element: <WorkspacePage />,
        },
        {
          path: "*",
          element: <Navigate to="/404" replace />,
        },
      ],
    },
  ]);

  const unAuthenticatedRoutes = useRoutes([
    {
      path: "/",
      element: <SignUpPage />,
    },
    {
      path: "/registration/step/1",
      element: <SignUpStepOnePage />,
    },
    {
      path: "/registration/step/2",
      element: <SignUpStepTwoPage />,
    },
    {
      path: "/registration/step/3",
      element: <SignUpStepThreePage />,
    },
    {
      path: "/registration/summary",
      element: <SignUpSummaryPage />,
    },
    {
      path: "/registration/summary/finish",
      element: <SignUpSummaryFinishPage />,
    },
    {
      path: "/login",
      element: <SignInPage />,
    },
    {
      path: "/forgot-password",
      element: <ForgotPasswordPage />,
    },
    {
      path: "/reset-password",
      element: <ResetPasswordPage />,
    },
    {
      path: "*",
      element: <Navigate to="/404" replace />,
    },
  ]);

  return isAuth ? authenticatedRoutes : unAuthenticatedRoutes;
}

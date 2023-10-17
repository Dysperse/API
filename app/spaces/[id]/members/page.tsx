"use client";

import { ConfirmationModal } from "@/components/ConfirmationModal";
import { AddPersonModal } from "@/components/Group/Members/Add";
import { capitalizeFirstLetter } from "@/lib/client/capitalizeFirstLetter";
import { useSession } from "@/lib/client/session";
import { fetchRawApi } from "@/lib/client/useApi";
import {
  Avatar,
  Chip,
  CircularProgress,
  Divider,
  Icon,
  IconButton,
  ListItem,
  ListItemText,
} from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { useMemo } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";
import { SpacesLayout } from "../page";

export default function Page() {
  const { session } = useSession();
  const router = useRouter();
  const params = useParams();
  const { id } = params as any;

  const accessToken = session.properties.find(
    (property) => property.propertyId == id
  )?.accessToken;

  const { error, mutate, data } = useSWR([
    "property/members",
    {
      propertyId: id,
      propertyAccessToken: accessToken,
    },
  ]);

  const members = useMemo(
    () => [...new Map(data?.map((item) => [item.user.email, item])).values()],
    [data]
  );

  return (
    <SpacesLayout title="People">
      {data ? (
        members.map((member: any) => (
          <ListItem
            key={member.id}
            sx={{
              "& *": {
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                overflow: "hidden",
              },
            }}
          >
            <Avatar
              src={member.user?.Profile?.picture}
              sx={{
                width: 30,
                height: 30,
                fontSize: 13,
              }}
            >
              {member?.user?.name?.substring(0, 2)?.toUpperCase()}
            </Avatar>
            <ListItemText
              primary={member.user.name}
              secondary={member.user.email}
            />
            <Chip
              label={capitalizeFirstLetter(
                session.property.permission == "owner" &&
                  member.permission === "owner"
                  ? "You"
                  : member.permission
              )}
              sx={{ flexShrink: 0 }}
            />
            {session.property.permission !== "owner" ||
            member.permission === "owner" ? null : (
              <ConfirmationModal
                title="Remove person from space?"
                question="This person will no longer have access to anything inside this space. You can always add them back later"
                callback={async () => {
                  fetchRawApi(session, "property/members/remove", {
                    id: member.id,
                    removerName: session.user.name,
                    removeeName: member.user.name,
                    timestamp: new Date().toISOString(),
                  }).then(async () => {
                    await mutate();
                    toast.success("Removed person from your home");
                  });
                }}
              >
                <IconButton>
                  <Icon className="outlined">delete</Icon>
                </IconButton>
              </ConfirmationModal>
            )}
          </ListItem>
        ))
      ) : (
        <CircularProgress />
      )}
      <Divider sx={{ my: 2, maxWidth: "90%", mx: "auto" }} />
      <AddPersonModal
        members={members.map((e: any) => e.user.email)}
        mutate={mutate}
      >
        <ListItem>
          <Avatar sx={{ width: 30, height: 30 }}>
            <Icon>add</Icon>
          </Avatar>
          <ListItemText primary="Invite..." />
        </ListItem>
      </AddPersonModal>
    </SpacesLayout>
  );
}

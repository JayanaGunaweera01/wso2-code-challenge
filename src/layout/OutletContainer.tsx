import {
    Box,
    Breadcrumbs,
    Container,
    LinearProgress,
    Link as MUILink,
    Typography,
} from "@mui/material";
import Link from "next/link";
import React from "react";

function OutletContainer({
    title,
    children,
    isLoading = false,
    breadcrumbs = [],
}: {
    title?: string;
    children: React.ReactNode;
    isLoading?: boolean;
    breadcrumbs?: { label: string; link: string }[];
}) {
    return (
        <div>
            {isLoading && <LinearProgress color="secondary" />}
            <Box mt={3}>
                <Container maxWidth="md">
                    <Box
                        mb={3}
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        {title && <Typography variant="h4">{title}</Typography>}
                    </Box>
                    <Box>{children}</Box>
                </Container>
            </Box>
        </div>
    );
}

export default OutletContainer;

"use client";

import { useState, useEffect } from "react";
import { Button, Card, CardContent } from "@/app/components/Button";
import { getCandidates } from "../../services/api";

interface Candidate {
  candidate_id: number;
  name: string;
  email: string;
  phone?: string;
  applications: string[]; // or a more specific type if you have it
}

export function CandidatesList() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const data = await getCandidates();

        // Map your incoming data to the interface shape
        const mappedCandidates = data.map((candidates: any) => ({
          id: candidates.candidate_id,
          name: candidates.name,
          email: candidates.email,
          phone: candidates.phone,
          applications: candidates.applications || [],
        }));

        setCandidates(mappedCandidates);
      } catch (error) {
        console.error("Failed to fetch candidates:", error);
      }
    };

    fetchCandidates();
  }, []);

  return (
    <div
      style={{
        padding: "32px",
        flexGrow: 1,
        width: "100%",
        backgroundColor: "#F9FAFB",
        minHeight: "100vh",
      }}
    >
      <Card
        style={{
          width: "100%",
          boxShadow: "0px 10px 15px rgba(0, 0, 0, 0.1)",
          borderRadius: "16px",
          overflow: "hidden",
          backgroundColor: "#FFFFFF",
        }}
      >
        <CardContent>
          <table
            style={{
              width: "100%",
              textAlign: "left",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr
                style={{
                  borderBottom: "2px solid #364957",
                  backgroundColor: "#364957",
                  color: "#FFFFFF",
                }}
              >
                <th style={{ padding: "16px", fontSize: "18px" }}>Name</th>
                <th style={{ padding: "16px", fontSize: "18px" }}>Email</th>
                <th style={{ padding: "16px", fontSize: "18px" }}>
                  Phone Number
                </th>
                <th style={{ padding: "16px", fontSize: "18px" }}>
                  Applications
                </th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((candidates) => (
                <tr
                  key={candidates.candidate_id}
                  style={{
                    borderBottom: "1px solid #E5E7EB",
                    backgroundColor: "#F3F4F6",
                    transition: "background-color 0.2s",
                  }}
                >
                  <td
                    style={{
                      padding: "16px",
                      fontWeight: "500",
                      color: "#1F2937",
                    }}
                  >
                    {candidates.name}
                  </td>
                  <td style={{ padding: "16px", color: "#4B5563" }}>
                    {candidates.email}
                  </td>
                  <td style={{ padding: "16px", color: "#4B5563" }}>
                    {candidates.phone ?? "N/A"}
                  </td>
                  <td style={{ padding: "16px", color: "#4B5563" }}>
                    {candidates.applications.length
                      ? candidates.applications.join(", ")
                      : "No applications"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

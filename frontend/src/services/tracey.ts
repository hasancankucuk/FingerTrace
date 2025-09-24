export const askTracey = async (message: string) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "question": message
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow" as RequestRedirect
    };

    // Updated URL to match bot service
    const response = await fetch(`https://api.fingertrace.app/ask-trace`, requestOptions);
    if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data;
}

export const resetTracey = async () => {
    // Updated URL to match bot service
    const response = await fetch(`https://api.fingertrace.app/reset-conversation`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (!response.ok) {
        console.error('Failed to reset conversation');
        throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
}

// Analytics endpoints
export const getSessionHeatMap = async () => {
    const response = await fetch(`https://api.fingertrace.app/session-heatmap`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (!response.ok) {
        console.error('Failed to get session heatmap');
        throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
}

export const getAnalyticsDashboard = async () => {
    const response = await fetch(`https://api.fingertrace.app/analytics/dashboard`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
}

export const getSessionMetrics = async () => {
    const response = await fetch(`https://api.fingertrace.app/analytics/metrics`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
}

export const getUserSegmentation = async () => {
    const response = await fetch(`https://api.fingertrace.app/analytics/user-segmentation`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
}

export const getAccessibilityMetrics = async () => {
    const response = await fetch(`https://api.fingertrace.app/analytics/accessibility`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
}

export const exportAnalyticsData = async () => {
    const response = await fetch(`https://api.fingertrace.app/analytics/export`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
}

export const trackAnalytics = async (data: any) => {
    const response = await fetch(`https://api.fingertrace.app/analytics/track`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
}

export const getRealTimeMetrics = async () => {
    const response = await fetch(`https://api.fingertrace.app/analytics/realtime`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
}

export const getVisualizationData = async (chartType: string) => {
    const response = await fetch(`https://api.fingertrace.app/analytics/visualization/${chartType}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
}

// Journey endpoints
export const trackUserJourney = async (journeyData: any) => {
    const response = await fetch(`https://api.fingertrace.app/journey/track`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(journeyData)
    });

    if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
}

export const getJourneyAnalytics = async () => {
    const response = await fetch(`https://api.fingertrace.app/journey/analytics`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
}

export const getJourneyMap = async () => {
    const response = await fetch(`https://api.fingertrace.app/journey/map`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
}

// Feedback endpoints
export const submitFeedback = async (feedback: any) => {
    const response = await fetch(`https://api.fingertrace.app/feedback/submit`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(feedback)
    });

    if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
}

export const getFeedbackAnalytics = async () => {
    const response = await fetch(`https://api.fingertrace.app/feedback/analytics`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
}

export const getFeedbackSummary = async () => {
    const response = await fetch(`https://api.fingertrace.app/feedback/summary`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
}

// A/B Testing endpoints
export const setupABTest = async (testConfig: any) => {
    const response = await fetch(`https://api.fingertrace.app/ab-test/setup`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(testConfig)
    });

    if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
}

export const getABTestResults = async (testId: string) => {
    const response = await fetch(`https://api.fingertrace.app/ab-test/results/${testId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
}

export const assignTestVariant = async (testId: string, sessionId: string) => {
    const response = await fetch(`https://api.fingertrace.app/ab-test/assign/${testId}/${sessionId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
}

// Add the new record result endpoint
export const recordABTestResult = async (resultData: any) => {
    const response = await fetch(`https://api.fingertrace.app/ab-test/record-result`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(resultData)
    });

    if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
}

// Update Dialogue Testing endpoints
export const detectDialogueAnomalies = async () => {
    const response = await fetch(`https://api.fingertrace.app/dialogue-testing/anomaly-detection`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
}

export const getStatisticalDialogueTesting = async () => {
    const response = await fetch(`https://api.fingertrace.app/dialogue-testing/statistical`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
}

export const getPerformanceTrends = async () => {
    const response = await fetch(`https://api.fingertrace.app/dialogue-testing/performance-trends`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
}

// Legacy testing endpoints (kept for backward compatibility)
export const createABTest = async (testConfig: any) => {
    // Redirect to new endpoint
    return await setupABTest(testConfig);
}

export const getTestingAnalytics = async () => {
    // Return combined testing analytics
    try {
        const [anomalies, statistical, trends] = await Promise.all([
            detectDialogueAnomalies(),
            getStatisticalDialogueTesting(), 
            getPerformanceTrends()
        ]);

        return {
            anomalies,
            statistical,
            trends,
            summary: {
                totalAnomalies: anomalies.total_anomalies || 0,
                trendDirection: trends.trend_direction || 'stable',
                avgResponseTime: statistical.response_time_stats?.mean || 0
            }
        };
    } catch (error) {
        console.error('Error fetching testing analytics:', error);
        return {
            anomalies: { total_anomalies: 0 },
            statistical: { response_time_stats: { mean: 0 } },
            trends: { trend_direction: 'unknown' },
            summary: {
                totalAnomalies: 0,
                trendDirection: 'unknown',
                avgResponseTime: 0
            }
        };
    }
}

// Health endpoints
export const getHealthStatus = async () => {
    const response = await fetch(`https://api.fingertrace.app/health`, {
        method: "GET"
    });

    if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
}

export const getDetailedStatus = async () => {
    const response = await fetch(`https://api.fingertrace.app/health/status`, {
        method: "GET"
    });

    if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
}

export const getSystemMetrics = async () => {
    const response = await fetch(`https://api.fingertrace.app/health/metrics`, {
        method: "GET"
    });

    if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
}

// Dashboard endpoints
export const getExecutiveDashboard = async () => {
    const response = await fetch(`https://api.fingertrace.app/executive-dashboard`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
}

export const getCrossPlatformPerformance = async () => {
    const response = await fetch(`https://api.fingertrace.app/cross-platform-performance`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
}
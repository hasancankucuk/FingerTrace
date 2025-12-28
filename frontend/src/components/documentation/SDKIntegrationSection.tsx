import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CodeBlock } from "./CodeBlock"
import { useTranslation } from "react-i18next"

export const SDKIntegrationSection = () => {
  const { t } = useTranslation()

  const integrationExamples = {
    react: {
      title: t("landing.documentation.sdk_integration.examples.react.title"),
      description: t("landing.documentation.sdk_integration.examples.react.description"),
      code: `import { useState, useEffect } from 'react';
import { FingerprintSDK, postData } from '@fingertrace/trace-sdk';

export const useFingerprint = (workspaceId, apiKey) => {
  const [fingerprint, setFingerprint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const generateFingerprint = async () => {
      try {
        const result = await FingerprintSDK();
        setFingerprint(result.fingerprint);
        
        await postData('fingerprint', result, workspaceId, apiKey);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    generateFingerprint();
  }, [workspaceId, apiKey]);

  return { fingerprint, loading, error };
};`
    },
    vanilla: {
      title: t("landing.documentation.sdk_integration.examples.vanilla.title"),
      description: t("landing.documentation.sdk_integration.examples.vanilla.description"),
      code: `import { FingerprintSDK, postData } from '@fingertrace/trace-sdk';

class FingerprintManager {
  constructor(workspaceId, apiKey) {
    this.workspaceId = workspaceId;
    this.apiKey = apiKey;
    this.fingerprint = null;
  }

  async initialize() {
    try {
      const result = await FingerprintSDK();
      this.fingerprint = result.fingerprint;
      
      await postData('fingerprint', result, this.workspaceId, this.apiKey);
      return this.fingerprint;
    } catch (error) {
      console.error('Fingerprinting failed:', error);
      throw error;
    }
  }
}

// Usage
const manager = new FingerprintManager('workspace-id', 'api-key');
const fingerprint = await manager.initialize();`
    },
    vue: {
      title: t("landing.documentation.sdk_integration.examples.vue.title"),
      description: t("landing.documentation.sdk_integration.examples.vue.description"),
      code: `import { ref, onMounted } from 'vue';
import { FingerprintSDK, postData } from '@fingertrace/trace-sdk';

export function useFingerprint(workspaceId, apiKey) {
  const fingerprint = ref(null);
  const loading = ref(true);
  const error = ref(null);

  const generateFingerprint = async () => {
    try {
      const result = await FingerprintSDK();
      fingerprint.value = result.fingerprint;
      
      await postData('fingerprint', result, workspaceId, apiKey);
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  onMounted(() => {
    generateFingerprint();
  });

  return {
    fingerprint,
    loading,
    error,
    regenerate: generateFingerprint
  };
}`
    },
    angular: {
      title: t("landing.documentation.sdk_integration.examples.angular.title"),
      description: t("landing.documentation.sdk_integration.examples.angular.description"),
      code: `import { Injectable } from '@angular/core';
import { FingerprintSDK, postData } from '@fingertrace/trace-sdk';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FingerprintService {
  private fingerprintSubject = new BehaviorSubject<string | null>(null);
  public fingerprint$ = this.fingerprintSubject.asObservable();

  constructor() {}

  async initialize(workspaceId: string, apiKey: string): Promise<string> {
    try {
      const result = await FingerprintSDK();
      this.fingerprintSubject.next(result.fingerprint);
      
      await postData('fingerprint', result, workspaceId, apiKey);
      return result.fingerprint;
    } catch (error) {
      console.error('Fingerprinting failed:', error);
      throw error;
    }
  }
}`
    }
  }

  return (
    <section id="sdk-integration" className="mb-16">
      <div className="text-center mb-12">
        <Badge variant="outline" className="mb-4">
          {t("landing.documentation.sdk_integration.badge")}
        </Badge>
        <h2 className="text-3xl font-bold mb-4">
          {t("landing.documentation.sdk_integration.title")}
        </h2>
      </div>

      <Tabs defaultValue="react" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="react">
            {t("landing.documentation.sdk_integration.tabs.react")}
          </TabsTrigger>
          <TabsTrigger value="vanilla">
            {t("landing.documentation.sdk_integration.tabs.vanilla")}
          </TabsTrigger>
          <TabsTrigger value="vue">
            {t("landing.documentation.sdk_integration.tabs.vue")}
          </TabsTrigger>
          <TabsTrigger value="angular">
            {t("landing.documentation.sdk_integration.tabs.angular")}
          </TabsTrigger>
        </TabsList>

        {Object.entries(integrationExamples).map(([key, example]) => (
          <TabsContent key={key} value={key} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{example.title}</CardTitle>
                <CardDescription>{example.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <CodeBlock code={example.code} />
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  )
}
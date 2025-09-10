import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CodeBlock } from "./CodeBlock"

const integrationExamples = {
  react: {
    title: "React Hook Implementation",
    description: "Use this custom hook to integrate fingerprinting into your React components",
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
    title: "Vanilla JavaScript Implementation",
    description: "Basic implementation without any framework dependencies",
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
    title: "Vue.js Composable",
    description: "Vue 3 composable for fingerprint management",
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
    title: "Angular Service",
    description: "Injectable service for Angular applications",
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

export const SDKIntegrationSection = () => {
  return (
    <section id="sdk-integration" className="mb-16">
      <div className="text-center mb-12">
        <Badge variant="outline" className="mb-4">SDK Integration</Badge>
        <h2 className="text-3xl font-bold mb-4">Multiple Integration Options</h2>
      </div>

      <Tabs defaultValue="react" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="react">React</TabsTrigger>
          <TabsTrigger value="vanilla">Vanilla JS</TabsTrigger>
          <TabsTrigger value="vue">Vue.js</TabsTrigger>
          <TabsTrigger value="angular">Angular</TabsTrigger>
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
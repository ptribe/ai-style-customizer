"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { generateCssFromPrompt, StylePrompt } from "@/services/ai-styler";

// Common style prompts for quick selection
const STYLE_SUGGESTIONS: StylePrompt[] = [
  "Make it appear with Bauhaus aesthetics",
  "Update the site to feel modern, friendly, and tech-forward", 
  "I want it to look glassy and reflective",
  "Give everything a retro-gaming flair",
  "I want it as a hunter green theme",
  "Make it feel like Christmas"
];

// Example website sections for demo
const DemoSections = () => {
  return (
    <div className="space-y-8 py-4">
      <section>
        <h2 className="text-2xl font-bold mb-4">Product Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Feature One</CardTitle>
              <CardDescription>Description of the first feature</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This feature does amazing things for your workflow and productivity.</p>
            </CardContent>
            <CardFooter>
              <Button>Learn More</Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Feature Two</CardTitle>
              <CardDescription>Description of the second feature</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Enhance your creativity with this powerful tool and feature set.</p>
            </CardContent>
            <CardFooter>
              <Button>Learn More</Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Feature Three</CardTitle>
              <CardDescription>Description of the third feature</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Streamline your processes with our innovative approach.</p>
            </CardContent>
            <CardFooter>
              <Button>Learn More</Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
        <Card>
          <CardHeader>
            <CardTitle>Get in Touch</CardTitle>
            <CardDescription>We'd love to hear from you</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">Name</label>
                  <Input id="name" placeholder="Your name" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">Email</label>
                  <Input id="email" type="email" placeholder="Your email" />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">Message</label>
                <Textarea id="message" placeholder="Your message" />
              </div>
              <Button>Send Message</Button>
            </form>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export const MainApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState("preview");
  const [stylePrompt, setStylePrompt] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedCss, setGeneratedCss] = useState<string>("");
  const [selectedSuggestion, setSelectedSuggestion] = useState<number | null>(null);
  const { toast } = useToast();

  // Apply the generated CSS to the page
  useEffect(() => {
    if (generatedCss) {
      const styleElement = document.getElementById("dynamic-styles") || document.createElement("style");
      styleElement.id = "dynamic-styles";
      styleElement.innerHTML = generatedCss;
      
      if (!document.getElementById("dynamic-styles")) {
        document.head.appendChild(styleElement);
      }
    }
  }, [generatedCss]);

  const handleGenerateStyle = async () => {
    if (!stylePrompt) {
      toast({
        title: "Empty Prompt",
        description: "Please enter a style description or select a suggestion.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const css = await generateCssFromPrompt(stylePrompt);
      setGeneratedCss(css);
      setActiveTab("preview");
      toast({
        title: "Style Generated",
        description: "Your custom style has been applied to the preview.",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "An error occurred while generating the style.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSuggestionClick = (suggestion: string, index: number) => {
    setStylePrompt(suggestion);
    setSelectedSuggestion(index);
  };

  const handleResetStyles = () => {
    setGeneratedCss("");
    setStylePrompt("");
    setSelectedSuggestion(null);
    
    // Remove the dynamic styles
    const styleElement = document.getElementById("dynamic-styles");
    if (styleElement) {
      styleElement.innerHTML = "";
    }
    
    toast({
      title: "Styles Reset",
      description: "All custom styles have been removed.",
    });
  };

  return (
    <div className="space-y-6">
      <header className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">AI Style Customizer</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Customize website styling using natural language prompts
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Style Input</CardTitle>
            <CardDescription>
              Describe the style you want or select a suggestion
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Style Prompt</label>
              <Textarea 
                placeholder="Describe the style you want, e.g. 'Make it look modern and minimalist'"
                value={stylePrompt}
                onChange={(e) => setStylePrompt(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Quick Suggestions</label>
              <div className="space-y-2">
                {STYLE_SUGGESTIONS.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant={selectedSuggestion === index ? "default" : "outline"}
                    className="mr-2 mb-2 text-xs"
                    onClick={() => handleSuggestionClick(suggestion, index)}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="flex space-x-2 pt-4">
              <Button 
                onClick={handleGenerateStyle} 
                disabled={isGenerating}
                className="flex-1"
              >
                {isGenerating ? "Generating..." : "Generate Style"}
              </Button>
              <Button 
                variant="outline" 
                onClick={handleResetStyles}
                className="flex-1"
              >
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="pb-0">
            <CardTitle>Website Preview</CardTitle>
            <CardDescription>
              See how your style changes affect the website
            </CardDescription>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
              <TabsList>
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="css">Generated CSS</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent className="pt-4">
            <TabsContent value="preview" className="m-0">
              <div className="p-4 border rounded-md bg-background">
                <DemoSections />
              </div>
            </TabsContent>
            <TabsContent value="css" className="m-0">
              <div className="p-4 border rounded-md overflow-auto max-h-[600px] bg-muted/30">
                <pre className="text-xs">{generatedCss || "// No CSS generated yet. Enter a prompt and click 'Generate Style'."}</pre>
              </div>
            </TabsContent>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
          <CardDescription>
            Understanding the AI Style Customizer
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal ml-6 space-y-2">
            <li>Enter a natural language description of the style you want or select a suggestion.</li>
            <li>The AI analyzes your prompt and generates CSS that overrides the default styling.</li>
            <li>The generated CSS uses high specificity to override the base styles without modifying components.</li>
            <li>View the preview to see how your styling affects different UI components.</li>
            <li>Examine the generated CSS to understand how the AI translated your prompt into code.</li>
          </ol>
          <div className="mt-4">
            <p className="text-sm text-muted-foreground">
              In a production environment, this would connect to a language model API to generate the CSS.
              For this prototype, we're using predefined templates with some variations.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

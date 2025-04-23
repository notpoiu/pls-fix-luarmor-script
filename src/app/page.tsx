"use client";
import { useDarkLua } from "@/components/darklua-provider";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DownloadIcon, UploadIcon } from "lucide-react";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { checkForNestedMacros } from "@/lib/codechecker";

export default function Home() {
  const { transformLuau } = useDarkLua();
  const [code, setCode] = useState("");

  return (
    <main className="flex flex-col p-24 gap-5">
      <Card>
        <CardHeader>
          <CardTitle>Please fix my luarmor script 😔</CardTitle>
          <CardDescription>
            Automatically fix bad luarmor parsing errors
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2 w-full">
            <Label htmlFor="code">Code</Label>
            <Textarea
              className="h-[200px]"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-row gap-2">
          <Button
            onClick={() => {
              const file = document.createElement("input");
              file.type = "file";
              file.accept = ".lua,.luau,.txt";
              file.onchange = (e) => {
                const target = e.target as HTMLInputElement;
                if (!(target.files && target.files.length > 0)) {
                  return;
                }

                const reader = new FileReader();

                reader.onload = (e) => {
                  const content = e.target?.result as string;
                  setCode(content);
                };

                reader.readAsText(target.files[0]);
              };
              file.click();
            }}
            variant={"outline"}
          >
            <UploadIcon />
            <span className="max-sm:hidden">Import from File</span>
          </Button>
          <Button
            variant={"outline"}
            onClick={() => {
              const needsMacroWarning =
                !(
                  code.includes("LPH_NO_VIRTUALIZE") ||
                  code.includes("LPH_JIT") ||
                  code.includes("LPH_JIT_MAX")
                ) && localStorage.getItem("didWarn") !== "true";
              if (needsMacroWarning) {
                localStorage.setItem("didWarn", "true");
              }

              const { isNested, error } = checkForNestedMacros(code);
              if (isNested) {
                toast.error(error);
                return;
              }

              toast.promise(
                transformLuau(code, {
                  rules: [
                    "remove_types",
                    "remove_if_expression",
                    "remove_nil_declaration",
                    "remove_unused_if_branch",
                    "remove_unused_variable",
                    "remove_interpolated_string",
                    "remove_compound_assignment",
                    "remove_unused_while",
                    "remove_empty_do",
                  ],
                }),
                {
                  loading: "Transforming...",
                  success: (data) => {
                    try {
                      const blob = new Blob([data], {
                        type: "text/plain; charset=utf-8",
                      });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `patched_script_for_luarmor.lua`;
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      setTimeout(() => {
                        URL.revokeObjectURL(url);
                      }, 100);
                    } catch {
                      throw new Error("Failed to download the file");
                    }

                    if (needsMacroWarning) {
                      return {
                        message: "Transformed code successfully!",
                        description: (
                          <div>
                            <span className="text-yellow-400">Pro tip:</span> We
                            recommend adding Luraph macros to your code to
                            improve performance.
                            <br />
                            <br />
                            More details can be found here:{" "}
                            <span className="text-blue-400 hover:text-blue-500">
                              <a
                                href="https://lura.ph/dashboard/documents/macros"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                https://lura.ph/dashboard/documents/macros
                              </a>
                            </span>{" "}
                            <div className="flex flex-row flex-wrap gap-1 mb-2">
                              <span>(</span>
                              <pre>`LPH_NO_VIRTUALIZE`</pre>,{" "}
                              <pre>`LPH_JIT`</pre> and <pre>`LPH_JIT_MAX`</pre>
                              <span>)</span>
                            </div>
                            <span className="text-muted-foreground text-xs mt-3">
                              You will no longer see this notification
                            </span>
                          </div>
                        ),
                        duration: 10000,
                      };
                    }

                    return {
                      message: "Transformed code successfully!",
                      description:
                        "Code has been transformed successfully and has been downloaded.",
                    };
                  },
                  error: (err) => {
                    return {
                      message: "Error while transforming code",
                      description: (
                        <div>
                          <pre className="max-w-[300px] text-wrap">
                            {err instanceof Error ? err.message : err}
                          </pre>
                        </div>
                      ),
                    };
                  },
                }
              );
            }}
          >
            <DownloadIcon />
            <span className="max-sm:hidden">Export to File</span>
          </Button>
        </CardFooter>
      </Card>

      <p className="text-xs text-muted-foreground">
        Open Source on Github:{" "}
        <span className="text-blue-400 hover:text-blue-500">
          <a
            href="https://github.com/notpoiu/pls-fix-luarmor-script"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://github.com/notpoiu/pls-fix-luarmor-script
          </a>
        </span>
      </p>
    </main>
  );
}

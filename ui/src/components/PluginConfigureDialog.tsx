import { PluginStatus } from "@/hooks/stores";
import Modal from "@components/Modal";
import AutoHeight from "@components/AutoHeight";
import { GridCard } from "@components/Card";
import LogoBlueIcon from "@/assets/logo-blue.svg";
import LogoWhiteIcon from "@/assets/logo-white.svg";
import { ViewHeader } from "./MountMediaDialog";
import { Button } from "./Button";
import { useJsonRpc } from "@/hooks/useJsonRpc";
import { useCallback, useEffect, useState } from "react";

export default function PluginConfigureModal({
  plugin,
  open,
  setOpen,
}: {
  plugin: PluginStatus | null;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  return (
    <Modal open={!!plugin && open} onClose={() => setOpen(false)}>
      <Dialog plugin={plugin} setOpen={setOpen} />
    </Modal>
  )
}

function Dialog({ plugin, setOpen }: { plugin: PluginStatus | null, setOpen: (open: boolean) => void }) {
  const [send] = useJsonRpc();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(false);
  }, [plugin])

  const updatePlugin = useCallback((enabled: boolean) => {
    if (!plugin) return;
    if (!enabled) {
      if (!window.confirm("Are you sure you want to disable this plugin?")) {
        return;
      }
    }
    
    setLoading(true);
    send("pluginUpdateConfig", { name: plugin.name, enabled }, resp => {
      if ("error" in resp) {
        setError(resp.error.message);
        return
      }
      setOpen(false);
    });
  }, [send, plugin, setOpen])

  return (
    <AutoHeight>
      <div className="mx-auto max-w-4xl px-4 transition-all duration-300 ease-in-out">
        <GridCard cardClassName="relative w-full text-left pointer-events-auto">
          <div className="p-4">
            <div className="flex flex-col items-start justify-start space-y-4 text-left">
              <img
                src={LogoBlueIcon}
                alt="JetKVM Logo"
                className="h-[24px] dark:hidden block"
              />
              <img
                src={LogoWhiteIcon}
                alt="JetKVM Logo"
                className="h-[24px] dark:block hidden dark:!mt-0"
              />
              <div className="w-full space-y-4">
                <div className="flex items-center justify-between w-full">
                  <ViewHeader title="Plugin Configuration" description={`Configure the ${plugin?.name} plugin`} />
                  <div>
                    {/* Enable/Disable toggle */}
                    <Button
                      size="MD"
                      theme={plugin?.enabled ? "danger" : "light"}
                      text={plugin?.enabled ? "Disable Plugin" : "Enable Plugin"}
                      loading={loading}
                      onClick={() => {
                        updatePlugin(!plugin?.enabled);
                      }}
                    />
                  </div>
                </div>

                <div
                  className="space-y-2 opacity-0 animate-fadeIn"
                  style={{
                    animationDuration: "0.7s",
                  }}
                >
                  {error && <p className="text-red-500 dark:text-red-400">{error}</p>}
                  <p className="text-sm text-gray-500 dark:text-gray-400 py-10">
                    TODO: Plugin configuration goes here
                  </p>

                  <div
                    className="flex items-end w-full opacity-0 animate-fadeIn"
                    style={{
                      animationDuration: "0.7s",
                      animationDelay: "0.1s",
                    }}
                  >
                    <div className="flex justify-end w-full space-x-2">
                      <Button
                        size="MD"
                        theme="light"
                        text="Back"
                        disabled={loading}
                        onClick={() => {
                          setOpen(false);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </GridCard>
      </div>
    </AutoHeight>
  )
}